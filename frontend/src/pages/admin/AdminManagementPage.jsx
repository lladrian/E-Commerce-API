import { useState, useEffect } from "react";
import axios from "axios";
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../api/adminAPI';
import { toast } from 'react-hot-toast';

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    password: "",
    email: "",
    role: "admin"
  });
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [modalAdmin, setModalAdmin] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const API = "http://localhost:5000/api/users";

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const result = await getAllAdmins();
    setAdmins(result.data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdminId) {
          const result = await updateAdmin(editingAdminId, {
               first_name: form.first_name,        
               middle_name: form.middle_name,
               last_name: form.last_name,
               email: form.email
          });

          if(result?.success) {    
            toast.success('Updated successfully!');
          } else {
            toast.error(result?.error.response.data.message || result?.error?.message);
          }
      } else {
           const result = await createAdmin({
               first_name: form.first_name,        
               middle_name: form.middle_name,
               last_name: form.last_name,
               email: form.email,
               password: form.password,
          });

          if(result?.success) {    
            toast.success('Created successfully!');
          } else {
            toast.error(result?.error.response.data.message || result?.error?.message);
          }
      }
      fetchAdmins();
      closeFormModal();
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setForm({
      first_name: "",
      middle_name: "",
      last_name: "",
      password: "",
      email: "",
      role: "admin"
    });
    setIsEditMode(false);
    setEditingAdminId(null);
    setShowFormModal(true);
  };

  const openEditModal = (admin) => {
    setForm({
      first_name: admin.first_name,
      middle_name: admin.middle_name,
      last_name: admin.last_name,
      email: admin.email,
      role: admin.role,
    });
    setEditingAdminId(admin._id);
    setIsEditMode(true);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingAdminId(null);
    setForm({
      first_name: "",
      middle_name: "",
      last_name: "",
      password: "",
      email: "",
      role: "admin"
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
        const result = await deleteAdmin(id);
        if(result?.success) {    
          toast.success('Deleted successfully!');
        } else {
          toast.error(result?.error.response.data.message || result?.error?.message);
        }
      fetchAdmins();
    }
  };

  const openViewModal = (admin) => {
    setModalAdmin(admin);
  };

  const closeViewModal = () => {
    setModalAdmin(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>

      <button
        onClick={openAddModal}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Add New Admin
      </button>

      <table className="w-full bg-white shadow-md rounded overflow-x-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">First Name</th>
            <th className="p-3">Last Name</th>
            <th className="p-3">Email</th>
            {/* <th className="p-3">Role</th> */}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">No admins found.</td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin._id} className="border-t">
                <td className="p-3">{admin.first_name}</td>
                <td className="p-3">{admin.last_name}</td>
                <td className="p-3">{admin.email}</td>
                {/* <td className="p-3">{admin.role}</td> */}
                <td className="p-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => openViewModal(admin)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(admin)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* View Modal */}
      {modalAdmin && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <ul className="space-y-2">
              <li><strong>First Name:</strong> {modalAdmin.first_name}</li>
              <li><strong>Middle Name:</strong> {modalAdmin.middle_name}</li>
              <li><strong>Last Name:</strong> {modalAdmin.last_name}</li>
              <li><strong>Email:</strong> {modalAdmin.email}</li>
              {/* <li><strong>Role:</strong> {modalAdmin.role}</li> */}
              <li><strong>Created At:</strong> {modalAdmin.created_at}</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={closeViewModal}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Admin" : "Add Admin"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">

              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <label className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={form.middle_name}
                onChange={handleChange}
                placeholder="Middle Name"
                className="w-full border px-4 py-2 rounded"
                required
              />

              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border px-4 py-2 rounded"
                required
              />
              
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border px-4 py-2 rounded"
                required
              />
              {!isEditMode && (
                <>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full border px-4 py-2 rounded"
                    required
                    />
                </>
                )}


            {/* {isEditMode ? "Edit Admin" : "Add Admin"}
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border px-4 py-2 rounded"
                required
              /> */}
              {/* <select
                name="role"
                disabled
                value={form.role}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option  value="user">User</option>
                <option value="admin">Admin</option> 
              </select> */}
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
                  {isEditMode ? "Update Admin" : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
