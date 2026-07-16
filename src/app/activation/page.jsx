'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/utils/axios';
import { toast } from 'react-hot-toast';

export default function ActivationPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [transactionRequestId, setTransactionRequestId] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.isActivated) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleActivate = async (e) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    setLoading(true);
    setPaymentStatus('initiating');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/activation/initiate`,
        { phoneNumber }
      );

      if (response.data.success) {
        setTransactionRequestId(response.data.transactionRequestId);
        setPaymentStatus('pending');
        toast.success('STK Push sent! Check your phone and enter PIN.');
      }
    } catch (error) {
      console.error('Activation payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (transactionRequestId && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/activation/status`,
            { transactionRequestId }
          );

          const status = (response.data.status || '').toString().toLowerCase();

          if (status === 'completed' || response.data.isActivated) {
            clearInterval(interval);
            setPaymentStatus('completed');
            setLoading(false);
            toast.success('Account activated successfully!');
            await refreshUser();
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          } else if (status === 'failed') {
            clearInterval(interval);
            setPaymentStatus('failed');
            setLoading(false);
            toast.error('Payment failed. Please try again.');
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [transactionRequestId, paymentStatus, refreshUser, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] via-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 hero-pattern">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/3 rounded-full blur-3xl" />
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
            <span className="text-3xl">🔓</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold gold-text mb-2">Activate Account</h1>
          <p className="text-[#E8D5A3]">Pay activation fee to unlock all features</p>
        </div>

        <div className="bg-gradient-to-br from-[#2A2522] to-[#1A1715] rounded-2xl p-5 sm:p-6 border border-[#C9A84C]/20 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">KES 50</div>
            <p className="text-[#E8D5A3] text-sm mb-4">One-time account activation fee</p>
            <div className="space-y-2 text-left text-sm text-[#E8D5A3]">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Access all profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Unlock and chat with anyone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Earn KES 500 per chat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Instant M-Pesa payment</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleActivate} className="space-y-5">
          <div>
            <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-field"
              placeholder="0712345678"
              disabled={loading || paymentStatus === 'pending'}
            />
          </div>

          {paymentStatus === 'pending' && (
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#E8D5A3]">Waiting for payment confirmation...</p>
              <p className="text-[#E8D5A3]/60 text-sm mt-1">
                Please check your phone and enter M-Pesa PIN
              </p>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="text-center text-green-500">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium">Account activated!</p>
              <p className="text-sm">Redirecting to dashboard...</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center text-red-400">
              <p className="font-medium">Payment failed</p>
              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setLoading(false);
                  setTransactionRequestId(null);
                }}
                className="text-[#C9A84C] text-sm hover:text-white transition-colors mt-2"
              >
                Try Again
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || paymentStatus === 'pending'}
            className="w-full btn-primary py-4 rounded-xl text-base sm:text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : paymentStatus === 'pending' ? (
              'Waiting for payment...'
            ) : (
              'Activate Account - KES 50'
            )}
          </button>
        </form>

        <p className="text-center text-[#E8D5A3]/60 text-xs mt-4">
          Secure M-Pesa payment powered by MegaPay
        </p>
      </motion.div>
    </div>
  );
}
