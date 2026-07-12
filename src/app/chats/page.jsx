'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/utils/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchChats();
  }, [isAuthenticated, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialProfileId) {
      loadChatForProfile(initialProfileId);
    }
  }, [initialProfileId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#C9A84C] text-xl">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold gold-text mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#C9A84C]/20">
              <h2 className="text-white font-semibold text-lg">Conversations</h2>
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
                    className={`p-4 cursor-pointer transition-all border-b border-[#C9A84C]/10 ${
                      activeProfileId === chat.profileId._id 
                        ? 'bg-[#C9A84C]/10 border-l-2 border-l-[#C9A84C]' 
                        : 'hover:bg-[#2A2522]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 flex items-center justify-center overflow-hidden border border-[#C9A84C]/20 flex-shrink-0">
                        {chat.profileId.profilePhoto && chat.profileId.profilePhoto !== '/default-avatar.png' ? (
                          <img src={chat.profileId.profilePhoto} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/default-avatar.svg'; }} />
                        ) : (
                          <span className="text-xl">👤</span>
                        )}
                        {chat.profileId.onlineStatus === 'online' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1A1715]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {chat.profileId.fullName}
                        </p>
                        <p className="text-[#E8D5A3]/60 text-sm truncate">
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

          {/* Chat Area */}
          <div className="md:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col">
            {activeProfile ? (
              <>
                <div className="p-4 border-b border-[#C9A84C]/20 flex items-center gap-3">
                  <Link href={`/profiles/${activeProfile._id}`} className="text-[#E8D5A3] hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#A8893A]/10 flex items-center justify-center overflow-hidden border border-[#C9A84C]/20">
                    {activeProfile.profilePhoto && activeProfile.profilePhoto !== '/default-avatar.png' ? (
                      <img src={activeProfile.profilePhoto} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/default-avatar.svg'; }} />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{activeProfile.fullName}</h3>
                    <p className="text-[#E8D5A3] text-xs">
                      {activeProfile.onlineStatus === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
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

                <div className="p-4 border-t border-[#C9A84C]/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 input-field"
                      placeholder="Type a message..."
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending}
                      className="btn-primary px-6 py-3 rounded-xl"
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
                  <div className="text-5xl mb-4">💬</div>
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
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F0A] to-[#2D1B1B] flex items-center justify-center">
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
