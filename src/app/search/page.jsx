'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import Link from 'next/link';
import ImageWithLoader from '@/components/ImageWithLoader';

export default function SearchPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [county, setCounty] = useState('');
  const [category, setCategory] = useState('');
  const [counties, setCounties] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchCounties();
  }, [isAuthenticated, router]);

  const fetchCounties = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profiles/counties/all`);
      setCounties(response.data.counties || []);
    } catch (error) {
      console.error('Error fetching counties:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query && !county && !category) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (county) params.append('county', county);
      if (category) params.append('category', category);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/search?${params.toString()}`
      );
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
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
              <Link href="/search" className="nav-link nav-link-active">Search</Link>
              <Link href="/chats" className="nav-link">Messages</Link>
              <Link href="/favorites" className="nav-link">Favorites</Link>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Search</h2>
          <p className="text-[#E8D5A3] mb-8">Find your perfect match</p>
          <div className="section-divider" />
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSearch}
          className="glass-card rounded-2xl p-6 sm:p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                Search
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field"
                placeholder="Search by name, bio, or city..."
              />
            </div>
            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                City
              </label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="">All Counties</option>
                {counties.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Sugar Mommy">Sugar Mommy</option>
                <option value="Sugar Daddy">Sugar Daddy</option>
                <option value="Young Boy">Young Boy</option>
                <option value="Young Man">Young Man</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 rounded-xl"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Results */}
        {profiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <p className="text-[#E8D5A3]">Found {profiles.length} profiles</p>
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl h-80 shimmer" />
            ))}
          </div>
        ) : profiles.length === 0 && query ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[#E8D5A3] text-xl mb-2">No profiles found</p>
            <p className="text-[#E8D5A3]/60">Try adjusting your search</p>
          </motion.div>
        ) : profiles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                    <ImageWithLoader
                      src={profile.profilePhoto}
                      alt={profile.fullName}
                      onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                    />
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
        ) : null}
      </main>
    </div>
  );
}
