import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { notifyOrderStatus } from "../utils/notifications.js";

// Dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [products, orders, customers] = await Promise.all([
      Product.countDocuments(), Order.countDocuments(), User.countDocuments({ role: "customer" })
    ]);

    const revenueResult = await Order.aggregate([
      {
        $match: {
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalPrice"
          }
        }
      }
    ]);

    res.json({
      revenue: revenueResult[0]?.total || 0,
      orders,
      products,
      customers
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// Get all orders
export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
}
  // Get single order details
export const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("user", "name email");


    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }


    res.status(200).json(order);


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// Update order status by admin
export const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;


    const allowedTransitions = {
      processing: ["paid", "cancelled"],
      paid: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: []
    };

    const order = await Order.findById(req.params.id)
      .populate("user", "name email notificationPreferences");


    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }


    if (!allowedTransitions[order.status]?.includes(status)) {
      return res.status(409).json({ message: `Cannot change an order from ${order.status} to ${status}.` });
    }

    const updates = { status };
    if (status === "delivered") { updates.isDelivered = true; updates.deliveredAt = new Date(); }
    if (status === "paid") { updates.isPaid = true; updates.paidAt = new Date(); }

    // Compare-and-set prevents two admins from processing the same transition twice.
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, status: order.status },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("user", "name email notificationPreferences");
    if (!updatedOrder) return res.status(409).json({ message: "This order was changed by another administrator. Refresh and try again." });

    // Return reserved stock only after the compare-and-set cancellation succeeds.
    if (status === "cancelled") {
      const bulk = order.orderItems.map((item) => ({ updateOne: { filter: { _id: item.product }, update: { $inc: { countInStock: item.qty } } } }));
      if (bulk.length) await Product.bulkWrite(bulk);
    }

    // Send opt-in email/WhatsApp messages only after the database update succeeds.
    await notifyOrderStatus(updatedOrder);


    res.status(200).json(updatedOrder);



  } catch(error) {


    res.status(500).json({
      message: error.message
    });


  }

};
