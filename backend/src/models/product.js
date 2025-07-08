import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }, 
  description: {
    type: String,
    required: true
  }, 
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: "general"
  },
  filename: {
    type: String,
    default: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
  },
  created_at: {
    type: String,
    default: null
  },
});


export default mongoose.model('Product', ProductSchema);