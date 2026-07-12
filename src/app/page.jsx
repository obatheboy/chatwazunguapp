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
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] via-[#1A0F0A] to-[#2D1B1B] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A84C]/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold gold-text">ChatWazungu</h1>
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
            >
              Login
            </Link>
            <Link 
              href="/auth/register"
              className="btn-primary inline-flex items-center"
            >
              Join Now
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
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
            <span className="text-white block mb-2">Chat with Beautiful</span>
            <span className="gold-text">Wazungu Worldwide</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[#E8D5A3] text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Unlock profiles, chat with AI companions, and earn money. 
            Premium chat platform with 200+ beautiful profiles.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/auth/register"
              className="btn-primary text-lg px-10 py-4 rounded-full inline-flex items-center gap-2"
            >
              Get Started - KES 99/Unlock
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/auth/login"
              className="text-[#E8D5A3] hover:text-white px-6 py-3 rounded-full border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300"
            >
              Already have an account?
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 lg:mt-32"
        >
          {[
            { value: '200+', label: 'Beautiful Profiles', icon: '💬' },
            { value: 'KES 500', label: 'Per Unlock', icon: '💰' },
            { value: 'KES 99', label: 'Per Unlock', icon: '🔓' },
            { value: '24/7', label: 'AI Chat', icon: '💸' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
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
            { icon: '💰', title: 'Earn KES 500', desc: 'Per profile unlocked', color: 'from-green-500/10 to-emerald-500/10' },
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-24 text-center"
        >
          <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-[#E8D5A3] text-lg mb-8 max-w-xl mx-auto">
              Join thousands of users already earning money by chatting with beautiful profiles.
            </p>
            <Link
              href="/auth/register"
              className="btn-primary text-lg px-10 py-4 rounded-full inline-flex items-center gap-2"
            >
              Create Free Account
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C9A84C]/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold gold-text">ChatWazungu</h3>
            <p className="text-[#E8D5A3]/60 text-sm">
              Premium chat platform. Earn while you chat.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
