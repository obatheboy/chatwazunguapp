'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] via-[#1A0F0A] to-[#2D1B1B] relative overflow-hidden cursor-pointer" onClick={() => router.push('/auth/register')}>
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A84C]/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/3 rounded-full blur-3xl" />
      </div>

      {/* Centered Logo */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#C9A84C] to-[#A8893A] flex items-center justify-center shadow-2xl shadow-[#C9A84C]/40">
              <span className="text-3xl sm:text-4xl font-bold text-[#1A0F0A]">CW</span>
            </div>
            <span className="text-2xl sm:text-3xl font-bold gold-text text-center">ChatWazungu</span>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Premium Chat Platform
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            <span className="text-white block mb-3">Chat with Wazungu</span>
            <span className="gold-text block">and make over 3,000 daily</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[#E8D5A3] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Chat with wazungu, unlock profiles, and earn money every day. 
            Join thousands of users already making money on ChatWazungu.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg sm:text-xl px-10 sm:px-14 py-4 sm:py-5 rounded-full inline-flex items-center gap-3 shadow-2xl shadow-[#C9A84C]/40 animate-pulse-gold w-full sm:w-auto justify-center"
            >
              START CHATTING NOW
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 mt-12 sm:mt-20 lg:mt-32 max-w-3xl mx-auto"
        >
          {[
            { value: '200+', label: 'Beautiful Profiles', icon: '💬' },
            { value: 'KES 3,000+', label: 'Daily Earnings', icon: '💰' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="glass-card glass-card-hover p-4 sm:p-6 text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold gold-text mb-1">{stat.value}</div>
              <div className="text-[#E8D5A3] text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20"
        >
          {[
            { icon: '💬', title: '200+ Profiles', desc: 'Beautiful European women & men', color: 'from-blue-500/10 to-purple-500/10' },
            { icon: '💰', title: 'Earn KES 3,000+', desc: 'Daily earnings potential', color: 'from-green-500/10 to-emerald-500/10' },
            { icon: '🔓', title: 'KES 99/Unlock', desc: 'M-Pesa payment', color: 'from-yellow-500/10 to-orange-500/10' },
            { icon: '💸', title: 'Instant Withdraw', desc: 'Withdraw immediately after activating account', color: 'from-pink-500/10 to-rose-500/10' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card glass-card-hover p-4 sm:p-6 group"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-[#E8D5A3] text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C9A84C]/10 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A8893A] flex items-center justify-center">
                <span className="text-lg font-bold text-[#1A0F0A]">CW</span>
              </div>
              <h3 className="text-xl font-bold gold-text">ChatWazungu</h3>
            </div>
            <p className="text-[#E8D5A3]/60 text-sm">
              Premium chat platform. Earn while you chat.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
