import Order from "../models/Order.js";

// Creates an order from cart and checkout details.
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items provided.");
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

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
