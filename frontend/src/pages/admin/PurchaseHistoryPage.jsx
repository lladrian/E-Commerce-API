import React, { useEffect, useState } from "react";
import axios from "axios";
//import moment from "moment";
import { getAllOrderedCart } from '../../api/cartAPI';


const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrderedCart(); // Update this path as needed
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };


  // const total = orders?.reduce((sum, order) => {
  //   const orderTotal = order.items.reduce((orderSum, item) => {
  //     return orderSum + (item.quantity * (item.product?.price || 0));
  //   }, 0);
  //   return sum + orderTotal;
  // }, 0);

  const calculateOrderTotal = (order) => {
    if (!order || !order.items) return 0;

    return order.items.reduce((sum, item) => {
      return sum + item.quantity * (item.product?.price || 0);
    }, 0);
  };


  return (
    <div className="max-w-7xl mx-auto px-6 py-12 mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Purchase History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg">No completed purchases found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Cart ID: {order._id}</h2>
                  <p className="text-gray-600">Customer: {order.user?.first_name} {order.user?.last_name} ({order.user?.email})</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Paid at:</p>
                  <p className="text-sm font-medium text-indigo-600">{order.paid_at}</p>
                </div>
              </div>

             <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-gray-50 rounded-xl shadow-sm p-4 hover:shadow-md transition"
                >
                  <div className="w-60 h-60 flex-shrink-0 bg-white rounded-md overflow-hidden mr-4 border">
                    <img
                      src={item.product.filename || 'https://via.placeholder.com/150'}
                      alt={item.product.name}
                      className="w-full h-full object-fit"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-between flex-grow">
                    <h3 className="text-lg font-medium text-gray-800">
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                      {item.product.description}
                    </p>
                    <h3 className="text-lg font-medium text-gray-800">
                      {item.quantity} × ${item.product?.price}
                    </h3>
                    <p className="text-indigo-600 font-semibold mt-2">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
                {/* Left - Payment ID */}
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment ID: {order.payment_id}
                </h2>

                {/* Right - Total Amount */}
                <p className="text-xl font-bold text-indigo-700">
                  Total: ₱{calculateOrderTotal(order).toFixed(2) || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
