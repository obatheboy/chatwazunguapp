'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/utils/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import ImageWithLoader from '@/components/ImageWithLoader';

function ChatContent() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProfileId = searchParams.get('profileId');

  const [chats, setChats] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(initialProfileId);
  const [activeProfile, setActiveProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chats`);
      setChats(response.data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatForProfile = async (profileId) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chats/${profileId}`);
      if (response.data.success) {
        setActiveProfileId(profileId);
        setActiveProfile(response.data.chat.profileId);
        fetchMessages(profileId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load chat');
    }
  };

  const fetchMessages = async (profileId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chats/${profileId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeProfileId || sending) return;

    setSending(true);
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chats/${activeProfileId}/message`,
        { content: newMessage.trim() }
      );

      setMessages(prev => [...prev, response.data.message]);
      setMessages(prev => [...prev, response.data.aiResponse]);
      setNewMessage('');
      setIsTyping(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
      setIsTyping(false);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchChats();
  }, [isAuthenticated, router, fetchChats]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialProfileId) {
      loadChatForProfile(initialProfileId);
    }
  }, [initialProfileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080508] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#C9A84C] text-xl">Loading messages...</div>
        </div>
      </div>
    );
  }

  const firstName = activeProfile?.fullName?.split(' ')[0] || activeProfile?.fullName || '';
  const profileAge = activeProfile?.age || (activeProfile?.dateOfBirth ? (() => { const d = new Date(activeProfile.dateOfBirth); const n = new Date(); let a = n.getFullYear() - d.getFullYear(); const m = n.getMonth() - d.getMonth(); if (m < 0 || (m === 0 && n.getDate() < d.getDate())) a--; return a > 0 ? a : 'N/A'; })() : 'N/A');

  return (
    <div className="min-h-screen bg-[#080508]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Messages</h1>
            {activeProfile && (
              <p className="text-[#E8D5A3] text-xs sm:text-sm mt-1">
                Chatting with {activeProfile.fullName} • {profileAge !== 'N/A' ? `${profileAge} years` : ''} • {activeProfile.category}
              </p>
            )}
          </div>
          <Link
            href="/dashboard"
            className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 h-[500px] sm:h-[600px]">
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#C9A84C]/20">
              <h2 className="text-white font-semibold text-base sm:text-lg">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {chats.length === 0 ? (
                <div className="text-center p-8">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-[#E8D5A3]/60 text-sm">No conversations yet</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <motion.div
                    key={chat._id}
                    onClick={() => {
                      setActiveProfileId(chat.profileId._id);
                      setActiveProfile(chat.profileId);
                      fetchMessages(chat.profileId._id);
                    }}
                    whileHover={{ x: 4 }}
                    className={`p-3 sm:p-4 cursor-pointer transition-all border-b border-[#C9A84C]/10 ${
                      activeProfileId === chat.profileId._id
                        ? 'bg-[#C9A84C]/10 border-l-2 border-l-[#C9A84C]'
                        : 'hover:bg-[#2A2522]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 flex items-center justify-center overflow-hidden border border-[#C9A84C]/20 flex-shrink-0">
                        <ImageWithLoader
                          src={chat.profileId.profilePhoto}
                          alt=""
                          onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                        />
                        {chat.profileId.onlineStatus === 'online' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#080508]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {chat.profileId.fullName}
                        </p>
                        <p className="text-[#E8D5A3]/60 text-xs truncate">
                          {chat.messages.length > 0
                            ? chat.messages[chat.messages.length - 1].content.substring(0, 30) + '...'
                            : 'Start chatting'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="md:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col">
            {activeProfile ? (
              <>
                <div className="p-3 sm:p-4 border-b border-[#C9A84C]/20 flex items-center gap-3">
                  <Link href={`/profiles/${activeProfile._id}`} className="text-[#E8D5A3] hover:text-white transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 flex items-center justify-center overflow-hidden border border-[#C9A84C]/20 flex-shrink-0">
                    <ImageWithLoader
                      src={activeProfile.profilePhoto}
                      alt=""
                      onError={(e) => { e.target.src = '/default-avatar.svg'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm sm:text-base truncate">{activeProfile.fullName}</h3>
                    <p className="text-[#E8D5A3] text-xs flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeProfile.onlineStatus === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      {activeProfile.onlineStatus === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                  <AnimatePresence>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 sm:px-4 sm:py-3 ${
                            msg.sender === 'user'
                              ? 'message-user'
                              : 'message-ai'
                          }`}
                        >
                          <p className="text-sm sm:text-base">{msg.content}</p>
                          <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-white/60' : 'text-[#E8D5A3]/40'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="message-ai rounded-2xl px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 sm:p-4 border-t border-[#C9A84C]/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 input-field"
                      placeholder={`Message ${firstName}...`}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending}
                      className="btn-primary px-4 sm:px-6 py-3 rounded-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-4">💬</div>
                  <p className="text-[#E8D5A3]/60 mb-4">Select a conversation to start chatting</p>
                  <Link href="/dashboard" className="text-[#C9A84C] hover:text-[#E8D5A3] font-medium transition-colors">
                    Browse profiles →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080508] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#C9A84C] text-xl">Loading...</div>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
