import crypto from "node:crypto";
import Order from "../models/Order.js";
import User from "../models/User.js";

const PAYSTACK_API = "https://api.paystack.co";
const currency = () => process.env.PAYSTACK_CURRENCY || "NGN";

const paystackRequest = async (path, options = {}) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack is not configured on the server.");
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  const body = await response.json();
  if (!response.ok || !body.status) throw new Error(body.message || "Paystack request failed.");
  return body.data;
};

const markOrderPaid = async (transaction, expectedReference = transaction.reference) => {
  if (transaction.status !== "success" || transaction.reference !== expectedReference) return null;
  const order = await Order.findOne({ paystackReference: expectedReference });
  if (!order || order.paymentMethod !== "Paystack") return null;
  const expectedAmount = order.totalPrice * 100;
  if (!Number.isSafeInteger(expectedAmount) || transaction.amount !== expectedAmount || transaction.currency !== currency()) return null;

  return Order.findOneAndUpdate(
    { _id: order._id, isPaid: false, status: "processing" },
    {
      $set: {
        isPaid: true,
        paidAt: new Date(),
        status: "paid",
        "paymentResult.id": String(transaction.id),
        "paymentResult.status": transaction.status,
        "paymentResult.updateTime": transaction.paid_at || new Date().toISOString(),
        "paymentResult.emailAddress": transaction.customer?.email || ""
      }
    },
    { new: true }
  );
};

// Starts a hosted Paystack checkout using the saved, server-calculated order total.
export const initializePaystackPayment = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.paymentMethod !== "Paystack" || order.isPaid || order.status !== "processing") {
      return res.status(409).json({ message: "This order cannot be paid." });
    }
    const user = await User.findById(req.user._id).select("email");
    if (!user?.email) return res.status(400).json({ message: "An email address is required for payment." });

    let reference = order.paystackReference;
    if (!reference) {
      reference = `FA-${order._id}-${crypto.randomBytes(8).toString("hex")}`;
      order.paystackReference = reference;
      await order.save();
    }
    const storefrontUrl = process.env.CLIENT_URLS?.split(",")[0]?.trim() || process.env.CLIENT_URL || "http://localhost:5173";
    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || `${storefrontUrl.replace(/\/$/, "")}/payment/verify`;
    const payment = await paystackRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        amount: order.totalPrice * 100,
        currency: currency(),
        reference,
        callback_url: callbackUrl,
        metadata: { orderId: order._id.toString() }
      })
    });
    res.json({ authorizationUrl: payment.authorization_url });
  } catch (error) { next(error); }
};

// Confirms the provider transaction against the order and returns its paid state.
export const verifyPaystackPayment = async (req, res, next) => {
  try {
    const reference = String(req.query.reference || "");
    if (!reference || reference.length > 100) return res.status(400).json({ message: "Payment reference is invalid." });
    const order = await Order.findOne({ paystackReference: reference, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Payment order not found." });
    if (order.isPaid) return res.json({ orderId: order._id, paid: true });

    const transaction = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
    let paidOrder = await markOrderPaid(transaction, reference);
    if (!paidOrder) paidOrder = await Order.findOne({ paystackReference: reference, user: req.user._id, isPaid: true });
    if (!paidOrder) return res.status(402).json({ message: "Payment has not been confirmed. If you completed payment, please refresh shortly." });
    res.json({ orderId: paidOrder._id, paid: true });
  } catch (error) { next(error); }
};

// Paystack sends signed raw JSON. Invalid signatures and unmatched transactions are ignored.
export const handlePaystackWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = req.get("x-paystack-signature");
  if (!secret || !signature || !Buffer.isBuffer(req.body)) return res.sendStatus(401);
  const expected = crypto.createHmac("sha512", secret).update(req.body).digest();
  let supplied;
  try { supplied = Buffer.from(signature, "hex"); } catch { return res.sendStatus(401); }
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return res.sendStatus(401);

  let event;
  try { event = JSON.parse(req.body.toString("utf8")); } catch { return res.sendStatus(400); }
  if (event.event === "charge.success" && event.data?.reference) {
    try {
      const transaction = await paystackRequest(`/transaction/verify/${encodeURIComponent(event.data.reference)}`);
      await markOrderPaid(transaction, event.data.reference);
    } catch (error) {
      console.error("Paystack webhook verification failed:", error.message);
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(200);
};
