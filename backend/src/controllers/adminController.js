import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { notifyOrderStatus } from "../utils/notifications.js";

// Dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const customers = await User.countDocuments();

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


    const allowedStatuses = ["processing", "paid", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid order status" });

    const order = await Order.findById(req.params.id)
      .populate("user", "name email notificationPreferences");


    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }


    order.status = status;


    // Automatically update delivery state
    if (status === "delivered") {

      order.isDelivered = true;
      order.deliveredAt = Date.now();

    }


    // Automatically update payment state
    if (status === "paid") {

      order.isPaid = true;
      order.paidAt = Date.now();

    }


    const updatedOrder = await order.save();

    // Send opt-in email/WhatsApp messages only after the database update succeeds.
    notifyOrderStatus(order);


    res.status(200).json(updatedOrder);



  } catch(error) {


    res.status(500).json({
      message: error.message
    });


  }

};
