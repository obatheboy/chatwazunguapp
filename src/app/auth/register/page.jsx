'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';

export default function Register() {
  const { register, isAuthenticated, isActivated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (isActivated) {
        router.push('/dashboard');
      } else {
        router.push('/activation');
      }
    }
  }, [isAuthenticated, isActivated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        router.push('/activation');
      } else if (result.error === 'Phone number already registered') {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] via-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center p-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-[#C9A84C]/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 mb-4"
          >
            <span className="text-3xl">💬</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold gold-text mb-2">ChatWazungu</h1>
          <p className="text-[#E8D5A3]">Chat with beautiful people worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input-field"
              placeholder="0712345678"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : 'Join ChatWazungu'}
          </button>

          <div className="section-divider" />

          <p className="text-center text-[#E8D5A3] text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#C9A84C] hover:text-[#E8D5A3] font-medium transition-colors">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
