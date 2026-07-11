import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";


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