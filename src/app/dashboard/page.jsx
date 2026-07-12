'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import Link from 'next/link';
import Modal from '@/components/Modal';
import PaymentModal from '@/components/PaymentModal';
import ImageWithLoader from '@/components/ImageWithLoader';

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
    router.push('/wallet');
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
      {/* Fixed Professional Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A0F0A]/95 backdrop-blur-xl border-b border-[#C9A84C]/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8893A] flex items-center justify-center shadow-lg shadow-[#C9A84C]/30">
                <span className="text-sm sm:text-base font-bold text-[#1A0F0A]">CW</span>
              </div>
              <span className="text-lg sm:text-xl font-bold gold-text hidden sm:block">ChatWazungu</span>
            </Link>

            {/* Stats Bar */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[#E8D5A3] text-base font-medium">Your Earnings</span>
                <span className="text-white font-bold text-xl">KES {user.totalEarnings || 0}</span>
              </div>
              <div className="w-px h-8 bg-[#C9A84C]/20" />
              <div className="flex items-center gap-2">
                <span className="text-[#E8D5A3] text-base font-medium">Wallet</span>
                <span className="text-[#C9A84C] font-bold text-xl">KES {user.walletBalance || 0}</span>
              </div>
              <div className="w-px h-8 bg-[#C9A84C]/20" />
              <div className="flex items-center gap-2">
                <span className="text-[#E8D5A3] text-base font-medium">Unlocked</span>
                <span className="text-white font-bold text-xl">{user.totalUnlocks || 0}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleWithdrawClick}
                className="hidden sm:flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-lg font-semibold text-sm text-[#1A0F0A] bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] hover:shadow-lg hover:shadow-[#C9A84C]/40 transition-all duration-300"
              >
                <span>💰</span>
                <span>Withdraw</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Stats Bar */}
          <div className="lg:hidden flex items-center justify-between py-2 border-t border-[#C9A84C]/10">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-[#E8D5A3]">Earnings: </span>
                <span className="text-white font-semibold">KES {user.totalEarnings || 0}</span>
              </div>
              <div>
                <span className="text-[#E8D5A3]">Wallet: </span>
                <span className="text-[#C9A84C] font-semibold">KES {user.walletBalance || 0}</span>
              </div>
              <div>
                <span className="text-[#E8D5A3]">Unlocked: </span>
                <span className="text-white font-semibold">{user.totalUnlocks || 0}</span>
              </div>
            </div>
            <button
              onClick={handleWithdrawClick}
              className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs text-[#1A0F0A] bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3]"
            >
              💰 Withdraw
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20 lg:h-24" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Stats Banner */}
        <div className="lg:hidden glass-card rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-[#E8D5A3] text-xs font-medium">Your Earnings</p>
              <p className="text-white text-lg font-bold">KES {user.totalEarnings || 0}</p>
            </div>
            <div className="text-center border-x border-[#C9A84C]/20">
              <p className="text-[#E8D5A3] text-xs font-medium">Wallet Balance</p>
              <p className="text-[#C9A84C] text-lg font-bold">KES {user.walletBalance || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-[#E8D5A3] text-xs font-medium">Unlocked</p>
              <p className="text-white text-lg font-bold">{user.totalUnlocks || 0}</p>
            </div>
          </div>
        </div>

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
                          <ImageWithLoader
                            src={profile.profilePhoto}
                            alt={profile.fullName}
                            onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                          />

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
                          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-5 sm:py-6 rounded-xl text-lg sm:text-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]"
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

      {/* Withdraw notification */}
      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)}>
        <div className="p-6 text-center">
          <div className="text-4xl mb-3">💰</div>
          <p className="text-white font-medium text-lg mb-2">
            Withdraw immediately after activating your account.
          </p>
          <p className="text-[#E8D5A3]">
            Your earnings are ready for withdrawal anytime.
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
