import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getSpecificProduct } from '../../api/productAPI';
import { createCart } from '../../api/cartAPI';

export default function ProductDetails(user) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchSpecificProducts();
  }, []);

  const fetchSpecificProducts = async () => {
    const result = await getSpecificProduct(id);

    if (result?.success) {
      setProduct(result?.data?.data);
    } else {
      console.error(result?.error?.message);
    }
  };

   const fetchCreateCart = async (cartData) => {
    const result = await createCart(cartData);

    if (result?.success) {
        toast.success('Added to cart!');
    } else {
        toast.error(result?.error.response.data.message || result?.error?.message);
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

    fetchCreateCart(cartData);

    //toast.success('Added to cart!');
    setAdding(true);
    setTimeout(() => setAdding(false), 1000);
  };

  if (!product) {
    return <div className="p-6 text-center">Loading product...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium transition"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.filename || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full h-96 object-fit"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
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

            {/* Quantity input */}
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

          {/* Add to Cart Button */}
       {
        user.user ? (
            <button
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className={`w-full mt-4 py-3 rounded font-semibold transition ${
                product.stock <= 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            >
            {adding ? 'Adding...' : 'Add to Cart'}
            </button>
        ) : (
            <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 py-3 rounded font-semibold bg-yellow-500 hover:bg-yellow-600 text-white"
            >
            Please login to add to cart
            </button>
        )
        }

        </div>
      </div>
    </div>
  );
}
