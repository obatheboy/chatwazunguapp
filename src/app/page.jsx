'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

const SELECTED_FONT = "'Playfair Display', 'Georgia', serif";
const BODY_FONT = "'DM Sans', 'Segoe UI', sans-serif";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const isActivated = user?.isActivated || false;
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (isActivated) {
        router.replace('/dashboard');
      } else {
        router.replace('/activation');
      }
    }
  }, [isAuthenticated, isActivated, router]);

  return (
    <div className="min-h-screen bg-[#080508] relative overflow-hidden cursor-pointer" onClick={() => router.push('/auth/register')} style={{ fontFamily: BODY_FONT }}>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#080508] via-[#1A0A14] to-[#0D0810] opacity-90" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#FF2D95]/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-[#C9A84C]/4 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#9B2335]/3 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255,45,149,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(201,168,76,0.05) 0%, transparent 50%)'
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center items-center pt-8 sm:pt-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A8893A] flex items-center justify-center shadow-lg shadow-[#C9A84C]/40">
              <span className="text-lg sm:text-xl font-bold text-[#1A0F0A]" style={{ fontFamily: SELECTED_FONT }}>SL</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold gold-text" style={{ fontFamily: SELECTED_FONT }}>The Sugar Life</span>
          </div>
        </motion.div>

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D95]/10 border border-[#FF2D95]/20 text-[#FF2D95] text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 bg-[#FF2D95] rounded-full animate-pulse" />
              Premium Adult Chat
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-white"
              style={{ fontFamily: SELECTED_FONT }}
            >
              Are you looking for a rich Sugar Mummy? Or a wealthy Sugar Daddy?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-[#E8D5A3] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Connect with verified, generous, and attractive people near you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF2D95] to-[#D4267D] hover:from-[#FF4DA6] hover:to-[#E8358C] text-white font-bold text-lg sm:text-xl px-10 sm:px-14 py-4 sm:py-5 rounded-full transition-all duration-300 shadow-lg shadow-[#FF2D95]/30 hover:shadow-xl hover:shadow-[#FF2D95]/50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF2D95] focus:ring-offset-2 focus:ring-offset-[#080508]"
              >
                🔓 GET CONNECTED NOW
              </Link>
            </motion.div>
          </div>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="relative z-10 border-t border-[#C9A84C]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8893A] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#1A0F0A]" style={{ fontFamily: SELECTED_FONT }}>SL</span>
                </div>
                <span className="text-base font-bold gold-text" style={{ fontFamily: SELECTED_FONT }}>The Sugar Life</span>
              </div>
              <p className="text-[#E8D5A3]/40 text-xs">
                18+ Adult Platform. All models are 18+. Licensed and regulated.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1715',
            color: '#fff',
            border: '1px solid #C9A84C',
          },
        }}
      />
    </div>
  );
}
