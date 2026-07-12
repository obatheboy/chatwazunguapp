'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import Link from 'next/link';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchFeatured();
  }, [isAuthenticated, router]);

  const fetchFeatured = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profiles/featured`);
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error fetching featured profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      <header className="glass-card sticky top-0 z-50 border-b border-[#C9A84C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-bold gold-text hover:opacity-80 transition-opacity">
              ChatWazungu
            </Link>
            <nav className="flex items-center gap-1 flex-wrap">
              <Link href="/dashboard" className="nav-link">Home</Link>
              <Link href="/search" className="nav-link">Search</Link>
              <Link href="/chats" className="nav-link">Messages</Link>
              <Link href="/favorites" className="nav-link nav-link-active">Favorites</Link>
              <Link href="/wallet" className="nav-link">Wallet</Link>
              <Link href="/profile/edit" className="nav-link">Settings</Link>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Featured Profiles</h2>
          <p className="text-[#E8D5A3] mb-8">Hand-picked profiles just for you</p>
          <div className="section-divider" />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-[#E8D5A3] text-xl mb-2">No featured profiles yet</p>
            <p className="text-[#E8D5A3]/60">Check back later for amazing profiles</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                  <div className="relative overflow-hidden bg-gradient-to-b from-[#2A2522] to-[#1A1715]" style={{ aspectRatio: '4/5' }}>
                    {profile.profilePhoto && profile.profilePhoto !== '/default-avatar.png' ? (
                      <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/default-avatar.svg'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-50">👤</span>
                      </div>
                    )}
                      {profile.isVerified && (
                        <div className="absolute top-3 left-3 badge badge-verified">
                          ✓ Verified
                        </div>
                      )}
                      {profile.onlineStatus === 'online' && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 badge badge-online">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          <span>Online</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1715] via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-3">
                        <h3 className="text-white font-semibold text-lg mb-1 truncate">{profile.fullName}</h3>
                        <div className="flex items-center gap-2 text-[#E8D5A3] text-sm">
                          <span>{profile.age || 'N/A'} years</span>
                          <span className="w-1 h-1 bg-[#C9A84C] rounded-full flex-shrink-0" />
                          <span className="truncate">{profile.county}</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        {profile.isUnlocked ? (
                          <button onClick={(e) => { e.stopPropagation(); router.push(`/chats?profileId=${profile._id}`); }} className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-4 sm:py-5 rounded-xl text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]">
                            💬 Chat Now
                          </button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); router.push(`/unlock/${profile._id}`); }} className="w-full bg-gradient-to-r from-[#BB0000] to-[#8B0000] text-white font-bold py-4 sm:py-5 rounded-xl text-base sm:text-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                            <span>🔒</span> Unlock - KSh 99
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
