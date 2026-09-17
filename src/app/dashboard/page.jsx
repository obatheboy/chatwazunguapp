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
  const isActivated = user?.isActivated || false;
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!isActivated) {
      router.push('/activation');
      return;
    }
    fetchProfiles();
  }, [isAuthenticated, isActivated, router]);

  async function fetchProfiles() {
    try {
      setLoading(true);
      setError(null);
      const category = user?.category;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles?category=${encodeURIComponent(category || '')}`
      );
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to load profiles. Please try again.');
      if (profiles.length === 0) setProfiles([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleWithdrawClick = () => {
    if ((user?.totalUnlocks || 0) < 6) {
      setShowWithdrawModal(true);
    } else {
      router.push('/wallet');
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

  const categoryLabel = user?.category === 'Sugar Mommy' ? 'Sugar Mummy' : user?.category === 'Sugar Daddy' ? 'Sugar Daddy' : user?.category || 'Sugar Daddy';

  return (
    <div className="min-h-screen bg-[#080508]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080508]/98 backdrop-blur-xl border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8893A] flex items-center justify-center shadow-lg shadow-[#C9A84C]/30">
                <span className="text-xs font-bold text-[#1A0F0A]" style={{ fontFamily: "'Playfair Display', serif" }}>SL</span>
              </div>
              <span className="text-lg font-bold gold-text hidden sm:inline" style={{ fontFamily: "'Playfair Display', serif" }}>The Sugar Life</span>
            </Link>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[#E8D5A3]/60">Looking for:</span>
              <span className="px-2.5 py-1 rounded-full bg-[#FF2D95]/15 text-[#FF2D95] font-semibold text-xs border border-[#FF2D95]/20">
                {categoryLabel}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300 border border-red-400/30 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="h-14 sm:h-16" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {initialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl h-80 shimmer" />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-white text-lg mb-2">{error}</p>
            <button
              onClick={fetchProfiles}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Try Again
            </button>
          </motion.div>
        ) : profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white text-lg mb-2">No profiles available right now</p>
            <p className="text-[#E8D5A3]/60 mb-4">Check back soon for new matches</p>
            <button
              onClick={fetchProfiles}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Refresh
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
          >
            {profiles.map((profile, index) => (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
              >
                <div onClick={() => {
                  if (profile.isUnlocked) {
                    router.push(`/profiles/${profile._id}`);
                  } else {
                    setActiveProfile(profile);
                  }
                }} className="block h-full cursor-pointer">
                  <div className="profile-card h-full flex flex-col">
                    <div className="relative overflow-hidden bg-gradient-to-b from-[#2A2522] to-[#1A1715] rounded-t-2xl" style={{ aspectRatio: '4/5' }}>
                      <ImageWithLoader
                        src={profile.profilePhoto}
                        alt={profile.fullName}
                        onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                        {...(index < 4 ? { fetchPriority: 'high' } : {})}
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

                      {!profile.isUnlocked && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 badge bg-black/60 text-white border border-white/20">
                          🔒 Locked
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715] via-transparent to-transparent opacity-80" />
                    </div>

                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <div className="mb-2">
                        <div className="flex items-center gap-1.5 text-[#E8D5A3] text-xs sm:text-sm">
                          <span className="truncate font-medium">{profile.fullName}</span>
                          <span className="text-[#C9A84C] flex-shrink-0">{profile.age !== 'N/A' ? `, ${profile.age}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#E8D5A3]/60 text-xs mt-0.5">
                          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{profile.county || 'Nairobi'}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-3">
                        <button
                          onClick={(e) => handleChatNow(e, profile)}
                          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]"
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

      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)}>
        <div className="p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-white font-medium text-lg mb-2">
            Unlock {6 - (user?.totalUnlocks || 0)} more chats to withdraw.
          </p>
          <p className="text-[#E8D5A3]">
            You have unlocked {user?.totalUnlocks || 0} chats.
          </p>
          <button
            onClick={() => setShowWithdrawModal(false)}
            className="w-full btn-primary mt-5 py-3 rounded-xl"
          >
            Got it
          </button>
        </div>
      </Modal>

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
