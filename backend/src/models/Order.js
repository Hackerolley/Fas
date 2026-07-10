import mongoose from "mongoose";

// Order item snapshot keeps price/name/image stable after checkout.
const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  }
});

// Order schema tracks checkout totals, delivery state, and payment status.
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Card"
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ["processing", "paid", "shipped", "delivered", "cancelled"],
      default: "processing"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
