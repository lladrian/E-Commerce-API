import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payment_id: {
    type: String,
    default: null,
  },
  is_checked_out: {
    type: Boolean,
    default: false,
  },
  paid_at: {
    type: String,
    default: null,
  },
  created_at: {
    type: String,
    default: null,
  },
});

export default mongoose.model('Cart', CartSchema);
