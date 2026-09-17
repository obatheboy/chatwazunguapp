'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ImageWithLoader from '@/components/ImageWithLoader';
import PaymentModal from '@/components/PaymentModal';

function computeAge(dateOfBirth) {
  if (!dateOfBirth) return 'N/A';
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age > 0 ? age : 'N/A';
}

export default function ProfileDetail() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const profileId = params.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}`
      );
      setProfile(response.data.profile);
      setIsUnlocked(response.data.isUnlocked);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        toast.error('Profile not found');
        router.push('/dashboard');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, loading, router, profileId]);

  const handleUnlock = () => {
    setShowPaymentModal(true);
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chats/${profileId}`
      );
      if (response.data.success) {
        router.push('/chats?profileId=' + profileId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#C9A84C] text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <div className="text-white text-xl mb-4">Profile not found</div>
          <Link href="/dashboard" className="text-[#C9A84C] hover:underline transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const age = computeAge(profile.dateOfBirth);
  const firstName = profile.fullName?.split(' ')[0] || profile.fullName || 'Profile';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#E8D5A3] hover:text-white mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 relative aspect-square md:aspect-auto md:h-[600px] overflow-hidden">
                <ImageWithLoader
                  src={profile.profilePhoto}
                  alt={profile.fullName}
                  onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715]/80 via-transparent to-transparent md:bg-gradient-to-r" />

                {profile.onlineStatus === 'online' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 badge badge-online">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span>Online</span>
                  </div>
                )}

                {profile.isVerified && (
                  <div className="absolute top-4 left-4 badge badge-verified">
                    ✓ Verified
                  </div>
                )}
              </div>

              <div className="md:w-1/2 p-6 sm:p-8 flex flex-col">
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {profile.fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-[#E8D5A3] text-sm">
                    <span>{profile.category === 'white-female' ? '👩' : profile.category === 'white-male' ? '👨' : '👤'} {profile.category === 'white-female' ? 'Wazungu Woman' : profile.category === 'white-male' ? 'Wazungu Man' : profile.category}</span>
                    <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
                    <span>{age !== 'N/A' ? `${age} years old` : 'Age'}</span>
                    <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
                    <span>{profile.county || 'Nairobi'}</span>
                    <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
                    <span>{profile.onlineStatus === 'online' ? '🟢 Online' : 'Offline'}</span>
                  </div>
                </div>

                <div className="section-divider" />

                <div className="flex-1 mb-6">
                  <h3 className="text-[#C9A84C] font-semibold text-lg mb-3">About</h3>
                  <div className="bg-[#2A2522] rounded-xl p-4 border border-[#C9A84C]/10">
                    <p className="text-[#E8D5A3] leading-relaxed">
                      {isUnlocked ? (profile.bio || 'No bio provided') : 'This profile is locked. Unlock to view full details and start chatting.'}
                    </p>
                  </div>
                </div>

                {isUnlocked ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="stat-card">
                      <p className="text-[#C9A84C] font-semibold mb-1">Profile Unlocked 🎉</p>
                      <p className="text-[#E8D5A3]">Start chatting with {firstName} right away!</p>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      className="w-full btn-primary py-3.5 rounded-xl text-base"
                    >
                      💬 Start Chatting
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#2A2522] rounded-xl p-5 border border-[#C9A84C]/20 text-center">
                      <div className="text-4xl mb-3">🔒</div>
                      <p className="text-white font-medium mb-1">This profile is locked</p>
                      <p className="text-[#E8D5A3]/70 text-sm">
                        Unlock for KES 98 to chat and earn KES 500
                      </p>
                    </div>

                    <button
                      onClick={handleUnlock}
                      className="w-full btn-primary py-3.5 rounded-xl text-base"
                    >
                      🔓 Unlock {firstName} - KES 98
                    </button>

                    <div className="flex items-center justify-center gap-4 text-xs text-[#E8D5A3]/50">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secure payment
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Full access
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z-4 3a1 1 0 11-2 0 1 1 0 012 0zm-4 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                        Earn KES 500
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        profile={profile}
        onSuccess={() => {
          setIsUnlocked(true);
          if (refreshUser) refreshUser();
        }}
      />
    </div>
  );
}
