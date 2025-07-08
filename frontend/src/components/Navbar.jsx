import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
    const [open, setOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem('user'); // ✅ clear persisted user
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          ADR | MAN E-SHOP
        </Link>
        <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-700 hover:text-black px-4 py-2 border rounded"
        >
          Menu
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50">

            {user?.role === 'admin' ? (
              <>
                <Link
                  to="/admin_dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/user_management"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  User Management
                </Link>
                <Link
                  to="/admin_management"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Admin Management
                </Link>
                 <Link
                  to="/product_management"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Product Management
                </Link>
                <Link
                  to="/purchase_history"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Purchase History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </>
            )}


            {!user ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/login_admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                   Login Admin 
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/register_admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Register Admin 
                </Link>
              </>
            ) : (
              <>
                 {user?.role === 'user' ? (
                  <>
                    <Link
                      to="/cart"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Cart
                    </Link>
                      <Link
                      to="/user/purchase_history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Purchase History
                    </Link>
                  </>
                ) : (
                  null
                  // <Link
                  //   to="/"
                  //   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  //   onClick={() => setOpen(false)}
                  // >
                  //   Home
                  // </Link>
                )}
             
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
      </div>
    </nav>
  );
}
