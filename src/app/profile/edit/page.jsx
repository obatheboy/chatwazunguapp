'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function EditProfile() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [counties, setCounties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    county: '',
    category: '',
    lookingFor: '',
    profilePhoto: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        county: user.county || '',
        category: user.category || '',
        lookingFor: user.lookingFor || '',
        profilePhoto: user.profilePhoto || ''
      });
    }
    fetchCounties();
  }, [isAuthenticated, router, user]);

  const fetchCounties = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profiles/counties/all`);
      setCounties(response.data.counties || []);
    } catch (error) {
      console.error('Error fetching counties:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, formData);
      toast.success('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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
              <span className="text-3xl">✏️</span>
            </motion.div>
            <h1 className="text-3xl font-bold gold-text mb-2">Edit Profile</h1>
            <p className="text-[#E8D5A3]">Update your profile information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                County *
              </label>
              <select
                name="county"
                required
                value={formData.county}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="">Select city</option>
                {counties.map((county) => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                I am a *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="">Select category</option>
                {['Sugar Daddy', 'Sugar Mommy', 'Young Man', 'Young Woman'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                Looking For *
              </label>
              <select
                name="lookingFor"
                required
                value={formData.lookingFor}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="">Select who you're looking for</option>
                {['Sugar Daddy', 'Sugar Mommy', 'Young Man', 'Young Woman'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="input-field resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl text-base"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
