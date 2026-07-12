'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import Link from 'next/link';
import Modal from '@/components/Modal';
import PaymentModal from '@/components/PaymentModal';

export default function Dashboard() {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchProfiles();
  }, [isAuthenticated, router]);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles`
      );
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleWithdrawClick = () => {
    if ((user?.totalUnlocks || 0) >= 6) {
      router.push('/wallet');
    } else {
      setShowWithdrawModal(true);
    }
  };

  const handleChatNow = (e, profile) => {
    e.stopPropagation();
    if (profile.isUnlocked) {
      router.push(`/chats?profileId=${profile._id}`);
    } else {
      setActiveProfile(profile);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-[#C9A84C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/dashboard" className="text-2xl font-bold gold-text hover:opacity-80 transition-opacity">
                ChatWazungu
              </Link>
            </motion.div>
            
            <motion.nav 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-1 flex-wrap"
            >
              <Link href="/dashboard" className="nav-link nav-link-active">
                Home
              </Link>
              <Link href="/wallet" className="nav-link">
                Wallet
              </Link>
              <span className="badge badge-gold hidden sm:inline-flex">
                Unlocked: {user.totalUnlocks || 0}
              </span>
              <button
                onClick={handleLogout}
                className="nav-link text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                Logout
              </button>
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Earnings Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/10 via-[#A8893A]/5 to-[#C9A84C]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[#E8D5A3] text-sm font-medium">Your Earnings</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">KES {user.totalEarnings || 0}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-[#E8D5A3] text-sm font-medium">Wallet Balance</p>
              <p className="text-[#C9A84C] text-2xl sm:text-3xl font-bold">KES {user.walletBalance || 0}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-[#E8D5A3] text-sm font-medium">Unlocked Profiles</p>
              <p className="text-white text-2xl sm:text-3xl font-bold">{user.totalUnlocks || 0}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-3 sm:col-span-1 sm:flex-none"
            >
              <button
                onClick={handleWithdrawClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-[#1A0F0A] bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] hover:shadow-lg hover:shadow-[#C9A84C]/40 transition-all duration-300 animate-pulse-gold"
              >
                💰 Withdraw
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profiles Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl h-80 shimmer" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[#E8D5A3] text-xl mb-2">No profiles available right now</p>
            <p className="text-[#E8D5A3]/60">Check back soon for new matches</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {profiles.map((profile, index) => (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                    <div onClick={() => router.push(`/profiles/${profile._id}`)} className="block h-full cursor-pointer">
                      <div className="profile-card h-full flex flex-col">
                        <div className="relative overflow-hidden bg-gradient-to-b from-[#2A2522] to-[#1A1715] rounded-t-2xl" style={{ aspectRatio: '4/5' }}>
                          {profile.profilePhoto && profile.profilePhoto !== '/default-avatar.png' ? (
                            <img 
                              src={profile.profilePhoto} 
                              alt={profile.fullName}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                            />
                          ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl opacity-50">👤</span>
                          </div>
                        )}

                      {profile.onlineStatus === 'online' && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 badge badge-online">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          <span>Online</span>
                        </div>
                      )}

                      {profile.isVerified && (
                        <div className="absolute top-3 left-3 badge badge-verified">
                          ✓ Verified
                        </div>
                      )}

                      {profile.tags && profile.tags.length > 0 && (
                        <div className="absolute bottom-3 left-3 flex gap-1">
                          {profile.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="badge bg-red-600/90 text-white">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715] via-transparent to-transparent opacity-80" />
                    </div>

                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <div className="mb-3">
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">
                          {profile.fullName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[#E8D5A3] text-xs sm:text-sm">
                          <span>{profile.category === 'white-female' ? '👩 Woman' : '👨 Man'}</span>
                          <span className="w-1 h-1 bg-[#C9A84C] rounded-full flex-shrink-0" />
                          <span className="truncate">{profile.onlineStatus === 'online' ? 'Online' : 'Offline'}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={(e) => handleChatNow(e, profile)}
                          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          💬 Chat Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Withdraw notification (before 6 unlocks) */}
      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)}>
        <div className="p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-white font-medium text-lg mb-2">
            Activate at least 6 chats to be able to withdraw.
          </p>
          <p className="text-[#E8D5A3]">
            You have activated {user?.totalUnlocks || 0} chats.
          </p>
          <button
            onClick={() => setShowWithdrawModal(false)}
            className="w-full btn-primary mt-5 py-3 rounded-xl"
          >
            Got it
          </button>
        </div>
      </Modal>

      {/* Chat Now -> unlock payment flow */}
      <PaymentModal
        isOpen={!!activeProfile}
        onClose={() => setActiveProfile(null)}
        profile={activeProfile}
        onSuccess={() => {
          fetchProfiles();
          if (refreshUser) refreshUser();
        }}
      />
    </div>
  );
}
