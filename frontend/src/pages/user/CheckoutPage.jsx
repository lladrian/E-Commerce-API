import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductModal from './../../components/ProductModal';
import { checkout } from '../../api/paymentAPI';


export default function Checkout(user) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  //const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [productID, setProductID] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  //  const computedTotal = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    setCartItems(storedCart);
    fetchCheckout(storedCart);
    
   // setTotal(computedTotal);
  }, []);

  
    const fetchCheckout = async (cart_array) => {
      const result = await checkout(cart_array);
  
      if(result?.success) {
        handleStripeRedirect(result?.data?.data);
        console.log(result?.data?.data || []);
      } else {
        console.log(result?.error.message);
      }
    };

  const handleStripeRedirect = (url) => {
   window.location.href = url;
  };


  const handlePlaceOrder = () => {
    //localStorage.removeItem('cart');
    toast.success('Order placed successfully!');
    navigate('/');
  };

    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);


  return (
    <div className="max-w-4xl mx-auto px-4 py-10 mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      <ProductModal showModal={showModal} setShowModal={setShowModal} user={user} productID={productID} setCartItems={setCartItems}/>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(item => (
              <button
                onClick={() => {
                    setProductID(item._id);
                    setShowModal(true);
                }}
                className="cursor-pointer w-full text-left"
                key={item._id}
              >
              <div  className="bg-white shadow rounded p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">
                    {`${item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}`}
                  </p>
                </div>
                <img
                  src={item.filename || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            </button>
            ))}
          </div>

          <div className="text-right mt-6">
            <p className="text-xl font-bold text-green-700">Total: ${total.toFixed(2)}</p>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
