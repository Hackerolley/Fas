import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { notifyOrderStatus } from "../utils/notifications.js";

// Creates an order from cart and checkout details.
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items provided.");
    }

    // Rebuild prices from the catalogue so a browser cannot alter totals.
    const productIds = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productById = new Map(products.map((product) => [product._id.toString(), product]));
    const verifiedItems = orderItems.map((item) => {
      const product = productById.get(item.product);
      const qty = Number(item.qty);
      if (!product || !Number.isInteger(qty) || qty < 1 || product.countInStock < qty) throw new Error("One or more products are unavailable in the requested quantity.");
      return { product: product._id, name: product.name, qty, image: product.images?.[0]?.url || "", price: product.price };
    });
    const computedItemsPrice = verifiedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const computedShippingPrice = computedItemsPrice > 150 ? 0 : 12;
    const computedTaxPrice = computedItemsPrice * 0.08;

    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: computedItemsPrice,
      taxPrice: computedTaxPrice,
      shippingPrice: computedShippingPrice,
      totalPrice: computedItemsPrice + computedTaxPrice + computedShippingPrice
    });

    // Save the latest checkout address as a convenient default for the next purchase.
    await User.findByIdAndUpdate(req.user._id, { shippingAddress });

    res.status(201).json(order);
  } catch (error) {
    next(error);
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

// Marks an order as paid after a future payment provider confirms payment.
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found.");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "paid";
    order.paymentResult = req.body.paymentResult || {};

    const updatedOrder = await order.save();
    res.json(updatedOrder);
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
