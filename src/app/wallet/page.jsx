'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ImageWithLoader from '@/components/ImageWithLoader';

export default function WalletPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchWallet();
  }, [isAuthenticated, router]);

  const fetchWallet = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/wallet`);
      setWallet(response.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setWithdrawing(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/withdraw`,
        { amount: parseFloat(withdrawAmount), mpesaNumber }
      );
      toast.success(response.data.message);
      setWithdrawAmount('');
      fetchWallet();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#C9A84C] text-xl">Loading wallet...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      <header className="glass-card sticky top-0 z-50 border-b border-[#C9A84C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-bold gold-text hover:opacity-80 transition-opacity">
              ChatWazungu
            </Link>
            <nav className="flex items-center gap-1 flex-wrap">
              <Link href="/dashboard" className="nav-link">
                Home
              </Link>
              <Link href="/wallet" className="nav-link nav-link-active">
                Wallet
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/auth/login');
                }}
                className="nav-link text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Wallet</h2>
          <p className="text-[#E8D5A3] mb-8">Manage your earnings and withdrawals</p>
          <div className="section-divider" />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Earnings', value: `KES ${user?.totalEarnings || 0}`, sub: 'KES 500 per unlock', icon: '💰' },
            { label: 'Wallet Balance', value: `KES ${user?.walletBalance || 0}`, sub: 'Available to withdraw', icon: '💵' },
            { label: 'Unlocked Profiles', value: user?.totalUnlocks || 0, sub: '✅ Withdraw anytime', icon: '🔓' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-[#E8D5A3] text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-white text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-[#E8D5A3]/70 text-xs">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Withdrawal Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-2xl overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-[#C9A84C]/20">
            <h3 className="text-white font-semibold text-xl">Withdraw Earnings</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleWithdraw} className="space-y-5 max-w-md mx-auto">
              <div>
                <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                  Withdrawal Amount (KES)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount"
                  max={user?.walletBalance || 0}
                />
              </div>
              <div>
                <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                  M-Pesa Number
                </label>
                <input
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="input-field"
                  placeholder="0712345678"
                />
              </div>
              <button
                type="submit"
                disabled={withdrawing}
                className="w-full btn-primary py-3.5 rounded-xl"
              >
                {withdrawing ? 'Processing...' : 'Withdraw to M-Pesa'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Unlocked Profiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-[#C9A84C]/20">
            <h3 className="text-white font-semibold text-xl">Unlocked Profiles</h3>
          </div>
          <div className="p-6">
            {wallet?.unlockedProfiles?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-[#E8D5A3]/60">No unlocked profiles yet. Start unlocking to earn!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallet?.unlockedProfiles?.map((item) => (
                  <Link href={`/chats?profileId=${item.unlockedUserId._id}`} key={item._id}>
                    <div className="glass-card glass-card-hover p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 flex items-center justify-center overflow-hidden border border-[#C9A84C]/20">
                          <ImageWithLoader
                            src={item.unlockedUserId.profilePhoto}
                            alt=""
                            onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.unlockedUserId.fullName}</p>
                          <p className="text-[#E8D5A3] text-sm">{item.unlockedUserId.category}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
