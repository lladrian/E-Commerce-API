import { useEffect, useState } from 'react';
import axios from 'axios';

import { getAdminStats } from '../../api/adminAPI';


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const result = await getAdminStats();
      setStats(result?.data?.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.total_users || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Total Admins</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.total_admins || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Total Products</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.total_products || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Total Earnings</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">₱ {stats?.total_earnings?.toLocaleString() || 0}</p>
        </div>
      </div>
    </div>
  );
}
