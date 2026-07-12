'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!user?.isAdmin && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchAnalytics();
  }, [isAuthenticated, router, user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
        <div className="text-[#C9A84C] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      <header className="bg-[#1A1715]/95 backdrop-blur-sm border-b border-[#C9A84C]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#C9A84C]">Admin Dashboard</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[#E8D5A3] hover:text-white px-4 py-2 rounded-xl transition-colors"
          >
            Back to App
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={analytics?.totalUsers || 0} icon="👥" />
          <StatCard title="Active Users" value={analytics?.activeUsers || 0} icon="✅" />
          <StatCard title="Total Chats" value={analytics?.totalChats || 0} icon="💬" />
          <StatCard title="Revenue" value={`$${analytics?.totalRevenue || 0}`} icon="💰" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {['analytics', 'users', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#C9A84C] text-[#1A0F0A]'
                  : 'bg-[#1A1715] text-[#E8D5A3] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1715] rounded-2xl border border-[#C9A84C]/20 overflow-hidden"
        >
          {activeTab === 'analytics' && (
            <div className="p-6">
              <h3 className="text-white font-semibold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {analytics?.recentUsers?.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-3 bg-[#2A2522] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 flex items-center justify-center">
                        <span>👤</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{u.fullName}</p>
                        <p className="text-[#E8D5A3] text-sm">{u.phoneNumber}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-3 py-1 rounded-full">
                      {u.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <AdminUsers />
          )}

          {activeTab === 'payments' && (
            <AdminPayments />
          )}
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#1A1715] rounded-2xl p-6 border border-[#C9A84C]/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#E8D5A3] text-sm mb-1">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const verifyUser = async (userId) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/verify`);
      toast.success('User updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const suspendUser = async (userId) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/suspend`);
      toast.success('User updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#2A2522]">
          <tr>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">User</th>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">Phone</th>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">Category</th>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-[#C9A84C]/10">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <span className="text-white">{u.fullName}</span>
                </div>
              </td>
              <td className="p-4 text-[#E8D5A3]">{u.phoneNumber}</td>
              <td className="p-4">
                <span className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-3 py-1 rounded-full">
                  {u.category}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => verifyUser(u._id)}
                    className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-3 py-1 rounded-lg hover:bg-[#C9A84C]/30 transition-colors"
                  >
                    {u.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => suspendUser(u._id)}
                    className="text-xs bg-red-600/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-600/30 transition-colors"
                  >
                    {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/payments`);
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#2A2522]">
          <tr>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">User</th>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">Amount</th>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">Method</th>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">Status</th>
            <th className="text-left p-4 text-[#E8D5A3] font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-t border-[#C9A84C]/10">
              <td className="p-4">
                <div>
                  <p className="text-white">{p.userId?.fullName || 'Unknown'}</p>
                  <p className="text-[#E8D5A3] text-sm">{p.userId?.phoneNumber}</p>
                </div>
              </td>
              <td className="p-4 text-white">{p.currency} {p.amount}</td>
              <td className="p-4">
                <span className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-3 py-1 rounded-full capitalize">
                  {p.paymentMethod}
                </span>
              </td>
              <td className="p-4">
                <span className={`text-xs px-3 py-1 rounded-full capitalize ${
                  p.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                  p.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-red-600/20 text-red-400'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="p-4 text-[#E8D5A3]">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
