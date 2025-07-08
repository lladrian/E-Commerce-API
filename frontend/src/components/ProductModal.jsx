import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSpecificProduct } from '../api/productAPI';
import { updateCart } from '../api/cartAPI';
import { getAllCartSpecificUser } from '../api/cartAPI';


import { toast } from 'react-hot-toast';

export default function ProductModal({ showModal, setShowModal, user, productID, setCartItems }) {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (showModal) {
      fetchSpecificProduct();
    }
  }, [showModal]);

  const fetchSpecificProduct = async () => {
    const result = await getSpecificProduct(productID);
    if (result?.success) {
      setProduct(result.data?.data);
    } else {
      console.log(result.error.message);
    }
  };

  
    const handleAddToCart = () => {
      if (quantity < 1 || quantity > product.stock) {
        toast.error(`Quantity must be between 1 and ${product.stock}`);
        return;
      }
  
      const cartData = {
         user_id: user.user._id, // assumes user is passed in and has _id
         items_array: [
         {
            product: product._id,
            quantity: parseInt(quantity)
         }
        ]
      };  
  
      fetchUpdateCart(cartData);
  

      setAdding(true);
      setTimeout(() => setAdding(false), 1000);
    };


    
      const fetchAllCartSpecificUser = async (user_id) => {
        const result = await getAllCartSpecificUser(user_id);
        setCartItems(result?.data?.data?.items);
      };


      const fetchUpdateCart = async (cartData) => {
        const result = await updateCart(cartData);
    
        if (result?.success) {
            fetchAllCartSpecificUser(user?.user?._id);
            toast.success('Cart updated!');
        } else {
            toast.error(result?.error.response.data.message || result?.error?.message);
        }
        setShowModal(false)
      };
  

  if (!showModal || !product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl mx-auto rounded shadow-lg p-6 relative overflow-auto max-h-[90vh]">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={product.filename || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-96 object-fit rounded"
            />
          </div>

          {/* Info */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4 capitalize">Category: {product.category}</p>
              <p className="text-gray-700 mb-4">{product.description}</p>

              <div className="text-lg font-semibold text-green-600 mb-2">
                Price: ${product.price.toFixed(2)}
              </div>
              <div className={`mb-4 font-medium ${product.stock > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </div>

              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-24 border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              )}
            </div>

            {/* Button */}
            {user?.user ? (
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock <= 0}
                className={`w-full mt-4 py-3 rounded font-semibold transition ${
                  product.stock <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {adding ? 'Updating...' : 'Update Cart'}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-4 py-3 rounded font-semibold bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Please login to add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
