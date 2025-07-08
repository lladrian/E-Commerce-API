import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductModal from './../../components/ProductModal';
import { checkout } from '../../api/paymentAPI';
import { getAllCartSpecificUser, removeCartItem } from '../../api/cartAPI';





export default function Cart(user) {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productID, setProductID] = useState(0);
  const [cartID, setCartID] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCartSpecificUser(user?.user?._id);
  }, []);

  const fetchAllCartSpecificUser = async (user_id) => {
    const result = await getAllCartSpecificUser(user_id);
    setCartID(result?.data?.data?._id)
    setCartItems(result?.data?.data?.items);
  };

  const handleCheckout = () => {
    fetchCheckout(cartItems, cartID);
  };

   const fetchCheckout = async (cart_array, cartID) => {
        const result = await checkout(cart_array, cartID);
    
        if(result?.success) {
          handleStripeRedirect(result?.data?.data);
        } else {
          console.log(result?.error.message);
        }
    };
  
    const handleStripeRedirect = (url) => {
     window.location.href = url;
    };


    const fetchRemoveCart = async (cartData) => {
        const result = await removeCartItem(cartData);
    
        if(result?.success) {
            toast.success(result?.data.data);
            fetchAllCartSpecificUser(user?.user?._id);
        } else {
            toast.error(result?.error.response.data.message || result?.error?.message);
        }
    };
  

    const removeFromCart = (id) => {
        const cartData = {
            user_id: user.user._id, // assumes user is passed in and has _id
            product_id: id
        };  
        fetchRemoveCart(cartData);
    };

  const total = cartItems?.reduce((sum, item) => sum + item?.quantity * item?.product?.price, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-10">
      <ProductModal showModal={showModal} setShowModal={setShowModal} user={user} productID={productID} setCartItems={setCartItems}/>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h1>
      
      {cartItems?.length == 0 || cartItems?.length == undefined ? (
        <p className="text-gray-600">Your cart is empty. <Link to="/" className="text-blue-500">Continue shopping</Link>.</p>
      ) : (
        <div className="space-y-4">
          {cartItems?.map(item => (
            <div key={item._id} className="bg-white rounded shadow flex justify-between items-center p-4">
              <button
                onClick={() => {
                    setProductID(item.product._id);
                    setShowModal(true);
                }}
                className="cursor-pointer w-full text-left"
                >
                <div className="flex items-center gap-4">
                    <img
                    src={item.product.filename || 'https://via.placeholder.com/80'}
                    alt={item.product.name}
                    className="w-20 h-20 object-fit rounded"
                    />
                    <div>
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                    <p className="text-sm text-gray-600">
                        {`${item.quantity} × ${item.product.price.toFixed(2)} = ${(item.quantity * item.product.price).toFixed(2)}`}
                    </p>
                    </div>
                </div>
                </button>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}

        { user.user ? (
          <div className="text-right mt-4">
            <p className="text-lg font-semibold">Total: ${total?.toFixed(2) || 0}</p>
            <button
              onClick={() => handleCheckout()}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        ) : (
            <div className="text-right mt-4">
                <button
                onClick={() => navigate('/login')}
                className="mt-3 py-3 px-2 rounded font-semibold bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                Please login to add to cart
                </button>
            </div>
        )
        }

        
        </div>
      )}
    </div>
  );
}
