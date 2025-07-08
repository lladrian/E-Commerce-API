import { useState, useEffect } from "react";
import axios from "axios";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/productAPI';
import { toast } from 'react-hot-toast';

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const result = await getAllProducts();
    setProducts(result.data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
          const result = await updateProduct(editingProductId, {
               name: form.name,        
               price: form.price,
               description: form.description,
               stock: form.stock,
          });

          if(result?.success) {    
            toast.success('Updated successfully!');
          } else {
            toast.error(result?.error.response.data.message || result?.error?.message);
          }
      } else {
           const result = await createProduct({
               name: form.name,        
               price: form.price,
               description: form.description,
               stock: form.stock,
          });

          if(result?.success) {    
            toast.success('Created successfully!');
          } else {
            toast.error(result?.error.response.data.message || result?.error?.message);
          }
      }
      fetchProducts();
      closeFormModal();
    } catch (err) {
      console.error(err);
    }
  };


  const openAddModal = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      stock: "",
    });
    setIsEditMode(false);
    setEditingProductId(null);
    setShowFormModal(true);
  };


  const openEditModal = (product) => {
    setModalProduct(null);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });
    setEditingProductId(product._id);
    setIsEditMode(true);
    setShowFormModal(true);
  };


  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingProductId(null);
    setForm({
      name: "",
      price: "",
      description: "",
      stock: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
        const result = await deleteProduct(id);
        if(result?.success) {    
          toast.success('Deleted successfully!');
          setModalProduct(null);
        } else {
          toast.error(result?.error.response.data.message || result?.error?.message);
        }
      fetchProducts();
    }
  };

  const openViewModal = (product) => {
    setModalProduct(product);
  };

  const closeViewModal = () => {
    setModalProduct(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      <button
        onClick={openAddModal}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Add New Product
      </button>

      <table className="w-full bg-white shadow-md rounded overflow-x-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Product Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock Count</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => openViewModal(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                  {/* <button
                    onClick={() => openEditModal(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalProduct && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Left Side - Product Details */}
            <div className="w-full md:w-1/2 p-6 flex items-center justify-start">
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Details</h2>
                <ul className="space-y-3 text-gray-700">
                  <li><span className="font-semibold">Name:</span> {modalProduct.name}</li>
                  <li><span className="font-semibold">Price:</span> ₱{modalProduct.price}</li>
                  <li><span className="font-semibold">Stock:</span> {modalProduct.stock}</li>
                  <li><span className="font-semibold">Description:</span> {modalProduct.description}</li>
                  <li><span className="font-semibold">Created At:</span> {modalProduct.created_at}</li>
                </ul>
                <button
                    onClick={() => openEditModal(modalProduct)}
                    className="bg-yellow-500 text-white px-3 py-1 mt-5 rounded w-full"
                >
                 EDIT
                </button>
                <button
                    onClick={() => handleDelete(modalProduct._id)}
                    className="bg-red-600 text-white px-3 py-1 mt-3 rounded w-full"
                >
                  DELETE
                </button>
              </div>
            </div>

            {/* Right Side - Product Image */}
            <div className="w-full md:w-1/2 bg-gray-100 relative p-6 flex items-center justify-center">
              {/* Close Button in upper right */}
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <img
                src={modalProduct.filename} // Adjust path if needed
                alt={modalProduct.name}
                className="object-fit max-h-96 w-full rounded-md shadow"
              />
            </div>
          </div>
        </div>
      )}



      {/* Add/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">

              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <label className="block text-sm font-medium text-gray-700">Stock Count</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock Count"
                className="w-full border px-4 py-2 rounded"
                required
              />
              
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border px-4 py-2 rounded"
                required
              />
          
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
