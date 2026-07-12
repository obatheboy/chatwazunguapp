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

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A8893A] flex items-center justify-center shadow-lg shadow-[#C9A84C]/30">
              <span className="text-2xl font-bold text-[#1A0F0A]">CW</span>
            </div>
            <span className="text-2xl font-bold gold-text">ChatWazungu</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex gap-3"
          >
            <Link 
              href="/auth/login"
              className="nav-link"
              onClick={(e) => e.stopPropagation()}
            >
              Login
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
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
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight"
          >
            <span className="text-white block mb-3">Chat with Wazungu</span>
            <span className="gold-text block">and make over 3,000 daily</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[#E8D5A3] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Unlock profiles, chat with AI companions, and earn money every day. 
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
              className="btn-primary text-lg sm:text-xl px-12 sm:px-16 py-5 sm:py-6 rounded-full inline-flex items-center gap-3 shadow-2xl shadow-[#C9A84C]/40 animate-pulse-gold"
            >
              START CHATTING NOW
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 lg:mt-32"
        >
          {[
            { value: '200+', label: 'Beautiful Profiles', icon: '💬' },
            { value: 'KES 3,000+', label: 'Daily Earnings', icon: '💰' },
            { value: 'KES 99', label: 'Per Unlock', icon: '🔓' },
            { value: '24/7', label: 'AI Chat', icon: '💸' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="glass-card glass-card-hover p-6 text-center"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold gold-text mb-1">{stat.value}</div>
              <div className="text-[#E8D5A3] text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {[
            { icon: '💬', title: '200+ Profiles', desc: 'Beautiful European women & men', color: 'from-blue-500/10 to-purple-500/10' },
            { icon: '💰', title: 'Earn KES 3,000+', desc: 'Daily earnings potential', color: 'from-green-500/10 to-emerald-500/10' },
            { icon: '🔓', title: 'KES 99/Unlock', desc: 'M-Pesa payment', color: 'from-yellow-500/10 to-orange-500/10' },
            { icon: '💸', title: 'Withdraw', desc: 'After 6 unlocks', color: 'from-pink-500/10 to-rose-500/10' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card glass-card-hover p-6 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-[#E8D5A3] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C9A84C]/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
