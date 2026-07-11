import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

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