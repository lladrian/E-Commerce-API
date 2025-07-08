import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect  } from 'react';
import Login from './pages/user/LoginPage';
import Register from './pages/user/RegisterPage';
import Home from './pages/user/HomePage';
import ProductDetails from './pages/user/ProductDetailsPage';
import Cart from './pages/user/CartPage';
import Checkout from './pages/user/CheckoutPage';
import UserPurchaseHistoryPage from './pages/user/PurchaseHistoryPage';


import RegisterAdminPage from './pages/admin/RegisterAdminPage';
import LoginAdminPage from './pages/admin/LoginAdminPage';
import DashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminManagementPage from './pages/admin/AdminManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import PurchaseHistoryPage from './pages/admin/PurchaseHistoryPage';




import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 add loading

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser || !user) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // 👈 finish loading after checking
  }, []);

  if (loading) return <LoadingScreen />; // 👈 prevent premature render

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin_dashboard" element={<DashboardPage />} />
          <Route path="/user_management" element={<UserManagementPage />} />
          <Route path="/admin_management" element={<AdminManagementPage />} />
          <Route path="/product_management" element={<ProductManagementPage />} />
          <Route path="/purchase_history" element={<PurchaseHistoryPage />} />


          
          <Route path="/user/purchase_history" element={<UserPurchaseHistoryPage user={user}/>} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/login_admin" element={<LoginAdminPage setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register_admin" element={<RegisterAdminPage />} />
          <Route path="/product/:id" element={<ProductDetails user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          {/* <Route path="/checkout" element={user ? <Checkout user={user} /> : <Navigate to="/login" />} /> */}
        </Routes>
      </div>
   </>
  );
}