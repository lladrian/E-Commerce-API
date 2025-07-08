import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAllProducts } from '../../api/productAPI';



export default function Home() {
  const [products, setProducts] = useState([]);


    useEffect(() => {
        fetchAllProducts();
    }, []);
  
    const fetchAllProducts = async () => {
      const result = await getAllProducts();
  
      if(result?.success) {
            setProducts(result?.data?.data)
          //console.log(result?.data?.data || []);
      } else {
          console.log(result?.error.message);
      }
    };

  return (
  <div className="max-w-7xl mx-auto px-6 py-12 mt-10">
    <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
      Featured Products
    </h1>

    {products.length === 0 ? (
      <p className="text-gray-600 text-lg">No products found.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="h-60 bg-gray-100 overflow-hidden flex items-center justify-center ">
              <img
                src={product.filename || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="object-fit  h-full w-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                {product.name}
              </h2>

              <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <p className="text-lg font-bold text-indigo-600">₱{product.price}</p>
                <span className="text-sm text-gray-500">Sold: {product.total_sold || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);

}
