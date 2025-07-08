import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    default: "user"
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


export default mongoose.model('User', UserSchema);