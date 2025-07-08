import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { getAllAdmins, loginAdmin } from '../../api/adminAPI';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      fetchAllAdmins();
  }, []);

  const fetchAllAdmins = async () => {
    const result = await getAllAdmins();

    if(result?.success) {
       // console.log(result?.data?.data || []);
    } else {
        console.log(result?.error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginAdmin({
        email: email,        
        password: password,
    });

    if(result?.success) {   
        setUser(result.data.data);
        localStorage.setItem('user', JSON.stringify(result.data.data));
        toast.success('Login successful!');
        navigate('/admin_dashboard')
    } else {
        toast.error(result?.error.response.data.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login as ADMIN</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
