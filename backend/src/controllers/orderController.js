import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { notifyOrderStatus } from "../utils/notifications.js";

// Creates an order from cart and checkout details.
export const createOrder = async (req, res, next) => {
  const session = await Product.startSession();
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod
    } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0 || orderItems.length > 50) {
      res.status(400);
      throw new Error("No order items provided.");
    }

    const addressFields = ["fullName", "address", "city", "postalCode", "country", "phone"];
    if (!shippingAddress || typeof shippingAddress !== "object" || addressFields.some((field) => typeof shippingAddress[field] !== "string" || !shippingAddress[field].trim() || shippingAddress[field].length > 160)) {
      res.status(400); throw new Error("A complete shipping address is required.");
    }
    if (!["Paystack", "Cash on delivery"].includes(paymentMethod)) { res.status(400); throw new Error("Unsupported payment method."); }

    const requestedQuantities = new Map();
    for (const item of orderItems) {
      const productId = String(item?.product || "");
      const qty = Number(item?.qty);
      if (!/^[a-f\d]{24}$/i.test(productId) || !Number.isInteger(qty) || qty < 1 || qty > 20) { res.status(400); throw new Error("Order items are invalid."); }
      requestedQuantities.set(productId, (requestedQuantities.get(productId) || 0) + qty);
    }

    let order;
    await session.withTransaction(async () => {
      const productIds = [...requestedQuantities.keys()];
      const products = await Product.find({ _id: { $in: productIds }, status: "active" }).session(session);
      const productById = new Map(products.map((product) => [product._id.toString(), product]));
      if (products.length !== productIds.length) throw new Error("One or more products are unavailable.");

      // Conditional decrements make the stock check and update one atomic operation.
      for (const [productId, qty] of requestedQuantities) {
        const result = await Product.updateOne({ _id: productId, countInStock: { $gte: qty }, status: "active" }, { $inc: { countInStock: -qty } }, { session });
        if (result.modifiedCount !== 1) throw new Error("One or more products are unavailable in the requested quantity.");
      }
      const verifiedItems = [...requestedQuantities].map(([productId, qty]) => {
        const product = productById.get(productId);
        return { product: product._id, name: product.name, qty, image: product.images?.[0]?.url || "", price: product.price };
      });
      const itemsPrice = verifiedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
      const shippingPrice = itemsPrice > 15000 ? 0 : 1200;
      const taxPrice = Math.round(itemsPrice * 0.08);
      [itemsPrice, shippingPrice, taxPrice].forEach((amount) => { if (!Number.isSafeInteger(amount)) throw new Error("Order total is invalid."); });
      [order] = await Order.create([{ user: req.user._id, orderItems: verifiedItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice: itemsPrice + taxPrice + shippingPrice }], { session });
      await User.findByIdAndUpdate(req.user._id, { shippingAddress }, { session, runValidators: true });
    });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// Gets one order while ensuring normal users can only view their own order.
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      res.status(404);
      throw new Error("Order not found.");
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("You cannot view this order.");
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Lists orders for the current signed-in user.
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Lists every order for admin dashboard management.
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort("-createdAt");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Marks an order as delivered from the admin dashboard.
export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found.");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "delivered";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Updates fulfillment state and sends opted-in customer notifications.
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["processing", "paid", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) { res.status(400); throw new Error("Invalid order status."); }
    const order = await Order.findById(req.params.id).populate("user", "name email notificationPreferences");
    if (!order) { res.status(404); throw new Error("Order not found."); }
    order.status = status;
    if (status === "paid" && !order.isPaid) { order.isPaid = true; order.paidAt = Date.now(); }
    if (status === "delivered" && !order.isDelivered) { order.isDelivered = true; order.deliveredAt = Date.now(); }
    const updatedOrder = await order.save();
    notifyOrderStatus(order);
    res.json(updatedOrder);
  } catch (error) { next(error); }
};
