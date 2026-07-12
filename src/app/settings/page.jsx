'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [isAuthenticated, router, user]);

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { phoneNumber });
      toast.success('Phone number updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update phone');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
      toast.success('Account deleted');
      logout();
      router.push('/auth/register');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 mb-4"
            >
              <span className="text-3xl">⚙️</span>
            </motion.div>
            <h1 className="text-3xl font-bold gold-text mb-2">Settings</h1>
            <p className="text-[#E8D5A3]">Manage your account settings</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Account Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: user.fullName },
                  { label: 'Email', value: user.email || 'Not set' },
                  { label: 'Category', value: user.category },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-[#2A2522] rounded-xl border border-[#C9A84C]/10">
                    <span className="text-[#E8D5A3] text-sm font-medium">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-divider" />

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Update Phone Number</h3>
              <form onSubmit={handleUpdatePhone} className="space-y-4">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field"
                  placeholder="0712345678"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-xl"
                >
                  {loading ? 'Updating...' : 'Update Phone Number'}
                </button>
              </form>
            </div>

            <div className="section-divider" />

            <div>
              <h3 className="text-red-400 font-semibold text-lg mb-4">Danger Zone</h3>
              <div className="bg-red-900/10 border border-red-600/20 rounded-xl p-4">
                <p className="text-red-400/80 text-sm mb-3">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600/20 text-red-400 font-semibold py-3 rounded-xl hover:bg-red-600/30 transition-colors border border-red-600/20"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
