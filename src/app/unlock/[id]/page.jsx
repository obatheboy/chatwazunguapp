'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function UnlockProfile() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const profileId = params.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, router, profileId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}`
      );
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setPaymentLoading(true);
    try {
      if (selectedMethod === 'mpesa') {
        if (!phoneNumber) {
          toast.error('Please enter your M-Pesa phone number');
          setPaymentLoading(false);
          return;
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/mpesa/initiate`,
          { profileId, phoneNumber, amount: 99 }
        );
        if (response.data.success) {
          toast.success('M-Pesa STK Push sent! Check your phone.');
          setTimeout(() => {
            router.push('/wallet');
          }, 3000);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#C9A84C] text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-white text-xl">Profile not found</div>
          <Link href="/dashboard" className="text-[#C9A84C] hover:underline mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/profiles/${profileId}`}
          className="inline-flex items-center gap-2 text-[#E8D5A3] hover:text-white mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 mb-4 text-4xl"
              >
                🔓
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Unlock {profile.fullName}
              </h1>
              <p className="text-[#E8D5A3] text-lg">
                Get full access and start chatting with {profile.fullName}
              </p>
            </div>

            <div className="bg-[#2A2522] rounded-2xl p-6 sm:p-8 mb-8 border border-[#C9A84C]/10">
              <h3 className="text-[#C9A84C] font-semibold text-lg mb-6 text-center">What you get:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[
                  { icon: '💬', title: 'Instant Chat', desc: 'Start messaging now' },
                  { icon: '👤', title: 'Full Profile', desc: 'Complete bio & details' },
                  { icon: '💰', title: 'Earn KES 500', desc: 'Per unlock' },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="p-4"
                  >
                    <div className="text-3xl mb-3">{benefit.icon}</div>
                    <p className="text-white font-medium mb-1">{benefit.title}</p>
                    <p className="text-[#E8D5A3] text-sm">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-white font-semibold text-center text-lg">Select Payment Method</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'mpesa', icon: '📱', name: 'M-Pesa', price: 'KES 99' },
                  { id: 'card', icon: '💳', name: 'Card', price: '$5.00' },
                  { id: 'paypal', icon: '🅿️', name: 'PayPal', price: '$5.00' },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-2xl border-2 transition-all text-center ${
                      selectedMethod === method.id
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10 shadow-lg shadow-[#C9A84C]/10'
                        : 'border-[#C9A84C]/20 hover:border-[#C9A84C]/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{method.icon}</div>
                    <p className="text-white font-medium">{method.name}</p>
                    <p className="text-[#E8D5A3] text-sm">{method.price}</p>
                  </motion.button>
                ))}
              </div>

              {selectedMethod === 'mpesa' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-field"
                    placeholder="0712345678"
                  />
                </motion.div>
              )}

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full btn-primary py-4 rounded-xl text-base mt-6"
              >
                {paymentLoading ? 'Processing...' : 'Unlock Profile - KES 99'}
              </button>

              <p className="text-center text-[#E8D5A3]/50 text-sm">
                🔒 Secure payment. Instant chat access. Earn KES 500 per unlock.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
