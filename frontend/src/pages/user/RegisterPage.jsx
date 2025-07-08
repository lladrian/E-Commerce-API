import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createUser } from '../../api/userAPI';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = await createUser({
        first_name: form.first_name,        
        middle_name: form.middle_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
    });

    if(result?.success) {    
      toast.success('Registration successful!');
      setForm({
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          password: "",
          confirmPassword: "",
      });
      navigate('/login')
    } else {
      // console.log(result?.error.message);
      toast.error(result?.error.response.data.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-10">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              placeholder="Your First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
           <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Middle Name</label>
            <input
              type="text"
              placeholder="Your Middle Name"
              name="middle_name"
              value={form.middle_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
           <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Your Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <button
        type="button"
        onClick={() => navigate('/login')}
        className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        Back to Login
      </button>
      </div>
    </div>
  );
};

export default RegisterPage;
