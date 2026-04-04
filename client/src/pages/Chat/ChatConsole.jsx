import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import chatService from '../../services/chatService';
import { initiateSocketConnection, disconnectSocket, joinConversation, leaveConversation } from '../../utils/socket';
import useAuthStore from '../../stores/authStore';
import useUiStore from '../../stores/uiStore';

const ChatConsole = () => {
  const { user } = useAuthStore();
  const { chatDrafts, setChatDraft, clearChatDraft, lastConversationId, setLastConversationId } = useUiStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConversationList, setShowConversationList] = useState(true);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const getCounterparty = (conversation) => conversation?.participants?.find((participant) => participant._id !== user?._id) || conversation?.participants?.[0];

  useEffect(() => {
    // 1. Initialize Socket
    socketRef.current = initiateSocketConnection();

    // 2. Fetch Conversations
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await chatService.getConversations();
        setConversations(data);
      } catch (err) {
        console.error('Failed to load signal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();

    // 3. Setup global notification listener
    socketRef.current?.on('new_message_notification', (notif) => {
      // In a real app, show a toast or update conversation list
      console.log('Incoming Signal:', notif);
      // Refresh conversation list to show last message
      fetchConversations();
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const requestedConversationId = searchParams.get('conversation');
    const matchedConversation = requestedConversationId
      ? conversations.find((conversation) => conversation._id === requestedConversationId)
      : null;

    const rememberedConversation = !requestedConversationId && lastConversationId
      ? conversations.find((conversation) => conversation._id === lastConversationId)
      : null;

    if (matchedConversation) {
      setActiveChat(matchedConversation);
      setShowConversationList(false);
      setLastConversationId(matchedConversation._id);
    } else if (rememberedConversation) {
      setActiveChat(rememberedConversation);
      setSearchParams({ conversation: rememberedConversation._id });
      setShowConversationList(false);
    } else if (!requestedConversationId && conversations.length > 0) {
      setActiveChat((current) => current || conversations[0]);
    }
  }, [conversations, lastConversationId, searchParams, setLastConversationId, setSearchParams]);

  useEffect(() => {
    if (activeChat) {
      setLastConversationId(activeChat._id);
      setNewMessage(chatDrafts[activeChat._id] || '');

      // 1. Fetch Messages
      const fetchMessages = async () => {
        try {
          const data = await chatService.getMessages(activeChat._id);
          setMessages([...data].reverse()); // Backend sends newest first, we want oldest first for display
          await chatService.markAsRead(activeChat._id);
          
          // 2. Join Socket Room
          joinConversation(activeChat._id);
        } catch (err) {
          console.error(err);
        }
      };
      fetchMessages();

      // 3. Listen for real-time messages
      socketRef.current?.on('receive_message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      return () => {
        leaveConversation(activeChat._id);
        socketRef.current?.off('receive_message');
      };
    }
  }, [activeChat, chatDrafts, setLastConversationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    
    try {
      // We send via REST, socket in backend handles emitting 'receive_message'
      await chatService.sendMessage(activeChat._id, newMessage);
      setNewMessage('');
      clearChatDraft(activeChat._id);
    } catch (err) {
      console.error('Signal transmission failed:', err);
    }
  };

  return (
    <div className="pt-24 pb-4 px-4 max-w-7xl mx-auto min-h-[calc(100vh-6rem)] flex flex-col">
       <div className="flex-1 flex min-h-[70vh] overflow-hidden border border-gundam-cyan/20 rounded-lg bg-gundam-dark-surface/50 backdrop-blur-xl">
          {/* Sidebar: Conversations */}
          <div className={`${showConversationList || !activeChat ? 'flex' : 'hidden'} md:flex w-full md:w-80 md:min-w-80 border-r border-gundam-cyan/10 flex-col bg-black/40`}>
             <div className="p-6 border-b border-gundam-cyan/10">
                <h2 className="text-xl font-orbitron text-gundam-cyan glow-text tracking-widest uppercase">Communication</h2>
                <div className="text-[10px] text-gundam-text-secondary mt-1 uppercase font-orbitron tracking-tighter">Secure Link Established</div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-6 text-center text-gundam-cyan font-orbitron text-xs uppercase tracking-widest">Loading channels...</div>
                ) : conversations.map((conv) => {
                  const counterparty = getCounterparty(conv);

                  return (
                  <div 
                    key={conv._id}
                    onClick={() => {
                      setActiveChat(conv);
                      setSearchParams({ conversation: conv._id });
                      setLastConversationId(conv._id);
                      setShowConversationList(false);
                    }}
                    className={`p-4 border-b border-gundam-cyan/5 cursor-pointer hover:bg-gundam-cyan/5 transition-all ${activeChat?._id === conv._id ? 'bg-gundam-cyan/10 border-l-2 border-l-gundam-cyan' : ''}`}
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gundam-cyan/20 flex items-center justify-center font-orbitron text-gundam-cyan text-xs">
                           {counterparty?.displayName?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-white font-bold text-sm truncate">{counterparty?.displayName || 'Unknown Pilot'}</span>
                              <span className="text-[9px] text-gundam-text-secondary font-orbitron">12:45</span>
                           </div>
                           <p className="text-xs text-gundam-text-secondary truncate">{conv.lastMessage?.text}</p>
                        </div>
                     </div>
                  </div>
                  );
                })}
             </div>
          </div>

          {/* Main Chat Area */}
          <div className={`${showConversationList && activeChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col relative overflow-hidden bg-black/20`}>
             {activeChat ? (
                <>
                   {/* Chat Header */}
                   <div className="p-4 border-b border-gundam-cyan/10 flex items-center justify-between gap-3 bg-black/60 z-10">
                      <div className="flex items-center gap-3">
                         <button
                           type="button"
                           onClick={() => setShowConversationList(true)}
                           className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-gundam-cyan/20 text-gundam-cyan hover:bg-gundam-cyan/10"
                         >
                           <ArrowLeft size={16} />
                         </button>
                         <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                         <span className="text-white font-orbitron uppercase tracking-widest text-sm sm:text-base">
                           {getCounterparty(activeChat)?.displayName || 'Unknown Pilot'}
                         </span>
                      </div>
                      <div className="flex gap-4">
                         <button className="text-gundam-cyan text-[10px] font-orbitron uppercase tracking-widest hover:text-white transition-colors hidden sm:inline-flex">Terminate Mission</button>
                      </div>
                   </div>

                   {/* Messages */}
                   <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                      {messages.map((msg, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: msg.sender?._id === user?._id ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={msg._id} 
                          className={`flex ${msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                        >
                           <div className={`max-w-[88%] sm:max-w-[70%] ${msg.sender?._id === user?._id ? 'order-1' : 'order-2'}`}>
                              <div className={`p-4 ${msg.sender?._id === user?._id ? 'bg-gundam-cyan border-none text-black rounded-l-xl rounded-tr-xl' : 'bg-gundam-dark-surface border border-gundam-cyan/30 text-white rounded-r-xl rounded-tl-xl'} shadow-lg`}>
                                 <p className="text-sm leading-relaxed">{msg.text}</p>
                              </div>
                              <div className={`mt-2 text-[9px] font-orbitron text-gundam-text-secondary uppercase tracking-tighter ${msg.sender?._id === user?._id ? 'text-right' : 'text-left'}`}>
                                 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                           </div>
                        </motion.div>
                      ))}
                      <div ref={scrollRef}></div>
                   </div>

                   {/* Input Area */}
                   <form onSubmit={handleSend} className="p-4 border-t border-gundam-cyan/10 bg-black/40">
                      <div className="flex flex-col sm:flex-row gap-3 relative">
                         <input 
                            className="flex-1 bg-gundam-dark-surface border border-gundam-cyan/30 p-4 text-sm text-white focus:border-gundam-cyan outline-none transition-all rounded-lg"
                            placeholder="Input your message here..."
                             value={newMessage}
                            onChange={(e) => {
                              setNewMessage(e.target.value)
                              if (activeChat?._id) {
                                setChatDraft(activeChat._id, e.target.value)
                              }
                            }}
                         />
                         <button 
                            type="submit"
                            className="px-8 py-4 sm:py-0 bg-gundam-cyan text-black font-orbitron font-bold uppercase tracking-widest hover:bg-white transition-all rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                         >
                            Send
                         </button>
                      </div>
                   </form>

                   {/* Tech UI background lines */}
                   <div className="absolute inset-0 pointer-events-none opacity-5">
                      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_40px]"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:40px_100%]"></div>
                   </div>
                </>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gundam-text-secondary">
                   <div className="w-16 h-16 border-2 border-gundam-cyan/20 rounded-full flex items-center justify-center mb-4">
                      <span className="w-8 h-8 border border-gundam-cyan/40 rounded-full animate-ping"></span>
                   </div>
                   <p className="font-orbitron uppercase tracking-[0.3em] text-xs">Waiting for communication signal</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default ChatConsole;
