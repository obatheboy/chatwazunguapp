'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Register() {
  const { register, isAuthenticated, user } = useAuth();
  const isActivated = user?.isActivated || false;
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    localStorage.setItem('regCategory', category);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    localStorage.setItem('regCategory', selectedCategory);
    setStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const phone = formData.phoneNumber.trim();
    if (!phone) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit Kenyan phone number');
      return;
    }

    setLoading(true);
    try {
      const category = localStorage.getItem('regCategory') || 'Sugar Mommy';
      const result = await register({ ...formData, category });
      if (result.success) {
        localStorage.removeItem('regCategory');
        router.push('/dashboard');
      } else if (result.error === 'Phone number already registered') {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const savedCategory = localStorage.getItem('regCategory');
    if (savedCategory) setSelectedCategory(savedCategory);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#080508] flex items-center justify-center p-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-[#C9A84C]/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/2 rounded-full blur-3xl" />
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
            <span className="text-3xl">🔐</span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold gold-text mb-1">Join The Sugar Life</h1>
          <p className="text-[#E8D5A3] text-sm">Step {step} of 2</p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">Who are you looking for?</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <motion.button
                onClick={() => handleCategorySelect('Sugar Mommy')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 sm:p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
                  selectedCategory === 'Sugar Mommy'
                    ? 'border-[#FF2D95] bg-[#FF2D95]/10 shadow-[0_0_30px_rgba(255,45,149,0.2)]'
                    : 'border-[#C9A84C]/20 bg-[#1A1715] hover:border-[#C9A84C]/40'
                }`}
              >
                <div className="text-4xl sm:text-5xl mb-3">👩🏾</div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-1">Sugar Mummy</h3>
                <p className="text-[#E8D5A3] text-xs sm:text-sm">Rich, generous, mature women</p>
              </motion.button>

              <motion.button
                onClick={() => handleCategorySelect('Sugar Daddy')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 sm:p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
                  selectedCategory === 'Sugar Daddy'
                    ? 'border-[#FF2D95] bg-[#FF2D95]/10 shadow-[0_0_30px_rgba(255,45,149,0.2)]'
                    : 'border-[#C9A84C]/20 bg-[#1A1715] hover:border-[#C9A84C]/40'
                }`}
              >
                <div className="text-4xl sm:text-5xl mb-3">👨🏾</div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-1">Sugar Daddy</h3>
                <p className="text-[#E8D5A3] text-xs sm:text-sm">Wealthy, successful mature men</p>
              </motion.button>
            </div>

            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className="text-[#E8D5A3] text-sm">Selected: <span className="text-[#C9A84C] font-semibold">{selectedCategory}</span></p>
              </motion.div>
            )}

            <div className="mt-6">
              <button
                onClick={handleStep1Submit}
                disabled={!selectedCategory}
                className="w-full btn-primary py-3.5 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleStep2Submit}
            className="space-y-5"
          >
            <button
              type="button"
              onClick={handleBack}
              className="text-[#E8D5A3] hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">Almost there! Tell us about you</h2>

            <div>
              <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
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
              <p className="text-[#E8D5A3]/40 text-xs mt-1">Enter your 10-digit Kenyan mobile number</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Joining...
                </span>
              ) : 'Enter The Sugar Life 🍯'}
            </button>

            <p className="text-center text-[#E8D5A3] text-xs mt-2">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#C9A84C] hover:text-[#E8D5A3] font-medium transition-colors">
                Login
              </Link>
            </p>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
