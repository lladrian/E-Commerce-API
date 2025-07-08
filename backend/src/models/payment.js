import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['card', 'paypal', 'gcash', 'bank_transfer', 'cod'], // Add more as needed
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  transaction_id: {
    type: String, // ID from payment gateway
    default: null
  },
  paid_at: {
    type: String,
    default: null
  },
  created_at: {
    type: String,
    default: null
  },
});


export default mongoose.model('Payment', PaymentSchema);