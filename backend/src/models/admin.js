import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  }, 
  middle_name: {
    type: String,
    required: true
  }, 
  last_name: {
    type: String,
    required: true
  }, 
  password: { 
    type: String, 
    required: true,
  },
  role: { 
    type: String, 
    default: "admin"
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  created_at: {
    type: String,
    default: null
  },
});


export default mongoose.model('Admin', AdminSchema);