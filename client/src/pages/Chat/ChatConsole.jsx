import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, AudioLines, ImagePlus, Loader2, Mic, MicOff, Search, SendHorizontal, Trash2, Video } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import chatService from '../../services/chatService'
import userService from '../../services/userService'
import { initiateSocketConnection, disconnectSocket, joinConversation, leaveConversation } from '../../utils/socket'
import useAuthStore from '../../stores/authStore'
import useUiStore from '../../stores/uiStore'
import { useI18n } from '../../i18n/I18nProvider'

const MAX_ATTACHMENTS = 5

const COPY = {
  vi: {
    title: 'Liên lạc', subtitle: 'Kênh bảo mật đã thiết lập', loading: 'Đang tải hội thoại...', unknown: 'Phi công chưa xác định',
    terminate: 'Kết thúc phiên liên lạc', input: 'Nhập tin nhắn hoặc ghi chú đàm phán tại đây...', send: 'Gửi',
    waiting: 'Chọn một hội thoại để bắt đầu liên lạc', attach: 'Đính kèm media', image: 'Ảnh', video: 'Video', audio: 'Ghi âm',
    speech: 'Nói ra chữ', speechStop: 'Dừng chuyển giọng nói', record: 'Ghi âm voice note', recordStop: 'Dừng ghi âm',
    limit: 'Tối đa 5 tệp mỗi tin nhắn.', unsupportedMic: 'Trình duyệt này chưa hỗ trợ ghi âm.',
    unsupportedSpeech: 'Trình duyệt này chưa hỗ trợ chuyển giọng nói thành chữ.', sendFailed: 'Không thể gửi tín hiệu lúc này.',
    discoverTitle: 'Mở liên lạc mới', discoverSubtitle: 'Tìm người bán, trader hoặc thành viên để bàn bạc trước khi mua.',
    discoverPlaceholder: 'Tìm theo tên, email, vai trò hoặc thành phố...', discoverLoading: 'Đang quét danh bạ phi công...',
    noDiscover: 'Chưa tìm thấy thành viên phù hợp để mở liên lạc.', openDirect: 'Nhắn trực tiếp', opening: 'Đang mở kênh...',
    recent: 'Hội thoại gần đây', noConversations: 'Chưa có hội thoại nào. Hãy chọn một thành viên bên dưới để bắt đầu.',
    attachments: 'Tệp đính kèm', contextProduct: 'Đang bàn về sản phẩm', contextTrade: 'Đang bàn về giao dịch', reputation: 'Uy tín',
    preview: { image: 'Đã gửi hình ảnh', video: 'Đã gửi video', audio: 'Đã gửi ghi âm', mixed: 'Đã gửi tệp đính kèm' },
  },
  en: {
    title: 'Communication', subtitle: 'Secure Link Established', loading: 'Loading channels...', unknown: 'Unknown Pilot',
    terminate: 'Terminate Session', input: 'Type a message or negotiation note here...', send: 'Send',
    waiting: 'Select a conversation to start communicating', attach: 'Attach media', image: 'Image', video: 'Video', audio: 'Voice note',
    speech: 'Speech to text', speechStop: 'Stop dictation', record: 'Record audio', recordStop: 'Stop recording',
    limit: 'Maximum 5 files per message.', unsupportedMic: 'This browser does not support audio recording.',
    unsupportedSpeech: 'This browser does not support speech-to-text.', sendFailed: 'Unable to send the signal right now.',
    discoverTitle: 'Start a new link', discoverSubtitle: 'Find sellers, traders, or members to discuss before buying.',
    discoverPlaceholder: 'Search by name, email, role, or city...', discoverLoading: 'Scanning the pilot directory...',
    noDiscover: 'No matching members found for a new channel.', openDirect: 'Message now', opening: 'Opening channel...',
    recent: 'Recent conversations', noConversations: 'No conversations yet. Pick a member below to start one.',
    attachments: 'Attachments', contextProduct: 'Discussing product', contextTrade: 'Discussing trade listing', reputation: 'Rep',
    preview: { image: 'Shared image', video: 'Shared video', audio: 'Shared voice note', mixed: 'Shared attachments' },
  },
}

const sortConversations = (items) => [...items].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
const getFileKind = (file) => file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'image'
const formatBytes = (value = 0) => !value ? '0 B' : `${(value / (1024 ** Math.min(Math.floor(Math.log(value) / Math.log(1024)), 3))).toFixed(value < 1024 ? 0 : 1)} ${['B', 'KB', 'MB', 'GB'][Math.min(Math.floor(Math.log(value) / Math.log(1024)), 3)]}`

const ChatConsole = () => {
  const { locale } = useI18n()
  const copy = locale === 'vi' ? COPY.vi : COPY.en
  const { user } = useAuthStore()
  const { chatDrafts, setChatDraft, clearChatDraft, lastConversationId, setLastConversationId } = useUiStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [attachmentFiles, setAttachmentFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)
  const [contactQuery, setContactQuery] = useState('')
  const [discoverableUsers, setDiscoverableUsers] = useState([])
  const [discoverLoading, setDiscoverLoading] = useState(false)
  const [openingConversationId, setOpeningConversationId] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isDictating, setIsDictating] = useState(false)
  const scrollRef = useRef(null)
  const socketRef = useRef(null)
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const speechRecognitionRef = useRef(null)
  const speechBufferRef = useRef('')
  const speechRecognitionConstructor = useMemo(() => typeof window === 'undefined' ? null : (window.SpeechRecognition || window.webkitSpeechRecognition || null), [])

  const getCounterparty = (conversation) => conversation?.participants?.find((p) => p._id !== user?._id) || conversation?.participants?.[0]
  const upsertConversation = (conversation) => setConversations((prev) => sortConversations([conversation, ...prev.filter((item) => item._id !== conversation._id)]))
  const updateConversationPreview = (message) => setConversations((prev) => sortConversations(prev.map((item) => item._id === message.conversation ? { ...item, lastMessage: message, updatedAt: message.createdAt } : item)))

  useEffect(() => {
    socketRef.current = initiateSocketConnection()
    const fetchConversations = async () => {
      try {
        setLoading(true)
        setConversations(sortConversations(await chatService.getConversations()))
      } catch (error) {
        console.error('Failed to load conversations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
    socketRef.current?.on('new_message_notification', fetchConversations)
    return () => {
      stopRecording(true)
      stopDictation(true)
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    if (!user?._id) return undefined
    let active = true
    const timer = setTimeout(async () => {
      try {
        setDiscoverLoading(true)
        const data = await userService.discoverUsers(contactQuery, 8)
        if (active) setDiscoverableUsers(data)
      } catch (error) {
        console.error('Failed to discover users:', error)
        if (active) setDiscoverableUsers([])
      } finally {
        if (active) setDiscoverLoading(false)
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [contactQuery, user?._id])

  useEffect(() => {
    const requestedId = searchParams.get('conversation')
    const matched = requestedId ? conversations.find((item) => item._id === requestedId) : null
    const remembered = !requestedId && lastConversationId ? conversations.find((item) => item._id === lastConversationId) : null
    if (matched) {
      setActiveChat(matched)
      setShowConversationList(false)
      setLastConversationId(matched._id)
    } else if (remembered) {
      setActiveChat(remembered)
      setSearchParams({ conversation: remembered._id })
      setShowConversationList(false)
    } else if (!requestedId && conversations.length > 0) {
      setActiveChat((current) => current || conversations[0])
    }
  }, [conversations, lastConversationId, searchParams, setLastConversationId, setSearchParams])

  useEffect(() => {
    if (!activeChat) return undefined
    setLastConversationId(activeChat._id)
    setNewMessage(chatDrafts[activeChat._id] || '')
    setAttachmentFiles([])
    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessages(activeChat._id)
        setMessages([...data].reverse())
        await chatService.markAsRead(activeChat._id)
        joinConversation(activeChat._id)
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    }
    fetchMessages()
    const handleIncomingMessage = (message) => {
      if (message.conversation !== activeChat._id) return
      setMessages((prev) => [...prev, message])
      updateConversationPreview(message)
    }
    socketRef.current?.on('receive_message', handleIncomingMessage)
    return () => {
      leaveConversation(activeChat._id)
      socketRef.current?.off('receive_message', handleIncomingMessage)
    }
  }, [activeChat, chatDrafts, setLastConversationId])

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleTextChange = (value) => {
    setNewMessage(value)
    if (activeChat?._id) setChatDraft(activeChat._id, value)
  }

  const handleFileSelection = (event) => {
    const nextFiles = Array.from(event.target.files || [])
    if (!nextFiles.length) return
    setAttachmentFiles((prev) => [...prev, ...nextFiles].slice(0, MAX_ATTACHMENTS))
    event.target.value = ''
  }

  const removeAttachment = (targetIndex) => setAttachmentFiles((prev) => prev.filter((_, index) => index !== targetIndex))

  const stopRecording = (silent = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop()
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop())
    mediaRecorderRef.current = null
    mediaStreamRef.current = null
    setIsRecording(false)
    if (!silent && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('chat-recording-stopped'))
  }

  const stopDictation = (silent = false) => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.onend = null
      speechRecognitionRef.current.stop()
      speechRecognitionRef.current = null
    }
    speechBufferRef.current = ''
    setIsDictating(false)
    if (!silent && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('chat-dictation-stopped'))
  }

  const handleToggleRecording = async () => {
    if (isRecording) return stopRecording()
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return window.alert(copy.unsupportedMic)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const preferred = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
      const mimeType = preferred.find((type) => MediaRecorder.isTypeSupported?.(type))
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      const chunks = []
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        const extension = blob.type.includes('mp4') ? 'm4a' : 'webm'
        const file = new File([blob], `voice-note-${Date.now()}.${extension}`, { type: blob.type || 'audio/webm' })
        setAttachmentFiles((prev) => [...prev, file].slice(0, MAX_ATTACHMENTS))
        stopRecording(true)
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Unable to start recording:', error)
      window.alert(copy.unsupportedMic)
    }
  }

  const handleToggleDictation = () => {
    if (isDictating) return stopDictation()
    if (!speechRecognitionConstructor) return window.alert(copy.unsupportedSpeech)
    try {
      const recognition = new speechRecognitionConstructor()
      speechRecognitionRef.current = recognition
      speechBufferRef.current = ''
      recognition.lang = locale === 'vi' ? 'vi-VN' : 'en-US'
      recognition.interimResults = true
      recognition.continuous = false
      recognition.onresult = (event) => {
        let transcript = ''
        for (let index = 0; index < event.results.length; index += 1) transcript += event.results[index][0].transcript
        speechBufferRef.current = transcript.trim()
      }
      recognition.onend = () => {
        const transcript = speechBufferRef.current.trim()
        if (transcript) handleTextChange(`${newMessage} ${transcript}`.trim())
        speechRecognitionRef.current = null
        speechBufferRef.current = ''
        setIsDictating(false)
      }
      recognition.start()
      setIsDictating(true)
    } catch (error) {
      console.error('Unable to start speech recognition:', error)
      window.alert(copy.unsupportedSpeech)
    }
  }

  const handleOpenDirectConversation = async (targetUser) => {
    if (!targetUser?._id || openingConversationId) return
    try {
      setOpeningConversationId(targetUser._id)
      const conversation = await chatService.startDirectConversation(targetUser._id)
      upsertConversation(conversation)
      setActiveChat(conversation)
      setSearchParams({ conversation: conversation._id })
      setLastConversationId(conversation._id)
      setShowConversationList(false)
    } catch (error) {
      console.error('Unable to open direct conversation:', error)
      window.alert(copy.sendFailed)
    } finally {
      setOpeningConversationId('')
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    if ((!newMessage.trim() && attachmentFiles.length === 0) || !activeChat || sending) return
    try {
      setSending(true)
      const payload = attachmentFiles.length > 0
        ? attachmentFiles.reduce((formData, file) => {
            if (newMessage.trim()) formData.set('text', newMessage.trim())
            formData.append('attachments', file)
            return formData
          }, new FormData())
        : { text: newMessage.trim() }
      const message = await chatService.sendMessage(activeChat._id, payload)
      setMessages((prev) => [...prev, message])
      updateConversationPreview(message)
      setNewMessage('')
      setAttachmentFiles([])
      clearChatDraft(activeChat._id)
    } catch (error) {
      console.error('Signal transmission failed:', error)
      window.alert(copy.sendFailed)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col px-4 pb-4 pt-24">
      <div className="flex min-h-[70vh] flex-1 overflow-hidden rounded-lg border border-gundam-cyan/20 bg-gundam-dark-surface/50 backdrop-blur-xl">
        <aside className={`${showConversationList || !activeChat ? 'flex' : 'hidden'} w-full flex-col border-r border-gundam-cyan/10 bg-black/40 md:flex md:w-96 md:min-w-96`}>
          <div className="border-b border-gundam-cyan/10 p-6">
            <h2 className="glow-text text-xl font-orbitron uppercase tracking-widest text-gundam-cyan">{copy.title}</h2>
            <div className="mt-1 text-[10px] font-orbitron uppercase tracking-tighter text-gundam-text-secondary">{copy.subtitle}</div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto">
            <section className="border-b border-gundam-cyan/10 p-4">
              <p className="text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-cyan">{copy.discoverTitle}</p>
              <p className="mt-2 text-xs leading-relaxed text-gundam-text-secondary">{copy.discoverSubtitle}</p>
              <label className="mt-4 flex items-center gap-3 rounded-2xl border border-gundam-cyan/15 bg-black/20 px-3 py-3">
                <Search size={14} className="text-gundam-cyan" />
                <input type="text" value={contactQuery} onChange={(event) => setContactQuery(event.target.value)} placeholder={copy.discoverPlaceholder} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gundam-text-secondary" />
              </label>
              <div className="mt-4 space-y-3">
                {discoverLoading ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-gundam-cyan/10 bg-white/5 px-3 py-4 text-xs text-gundam-text-secondary">
                    <Loader2 size={14} className="animate-spin text-gundam-cyan" />
                    {copy.discoverLoading}
                  </div>
                ) : discoverableUsers.length > 0 ? discoverableUsers.map((member) => (
                  <div key={member._id} className="rounded-2xl border border-gundam-cyan/10 bg-white/5 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gundam-cyan/15 bg-gundam-cyan/10 text-sm font-orbitron text-gundam-cyan">{member.displayName?.[0] || '?'}</div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-white">{member.displayName || copy.unknown}</div>
                        <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-orbitron uppercase tracking-[0.18em] text-gundam-text-secondary">
                          {member.role ? <span>{member.role}</span> : null}
                          {member.address?.city ? <span>{member.address.city}</span> : null}
                          {typeof member.reputation === 'number' ? <span>{copy.reputation} {member.reputation}</span> : null}
                        </div>
                        <button type="button" onClick={() => handleOpenDirectConversation(member)} disabled={openingConversationId === member._id} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gundam-cyan/20 bg-gundam-cyan/10 px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.18em] text-gundam-cyan transition hover:border-gundam-cyan hover:bg-gundam-cyan hover:text-black disabled:cursor-not-allowed disabled:opacity-60">
                          {openingConversationId === member._id ? <Loader2 size={14} className="animate-spin" /> : <SendHorizontal size={14} />}
                          {openingConversationId === member._id ? copy.opening : copy.openDirect}
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-gundam-cyan/15 bg-white/5 px-3 py-4 text-xs leading-relaxed text-gundam-text-secondary">{copy.noDiscover}</div>
                )}
              </div>
            </section>
            <section>
              <div className="border-b border-gundam-cyan/10 px-4 py-3 text-[10px] font-orbitron uppercase tracking-[0.24em] text-gundam-cyan">{copy.recent}</div>
              {loading ? (
                <div className="p-6 text-center text-xs font-orbitron uppercase tracking-widest text-gundam-cyan">{copy.loading}</div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-xs leading-relaxed text-gundam-text-secondary">{copy.noConversations}</div>
              ) : conversations.map((conversation) => {
                const counterparty = getCounterparty(conversation)
                return (
                  <div key={conversation._id} onClick={() => {
                    setActiveChat(conversation)
                    setSearchParams({ conversation: conversation._id })
                    setLastConversationId(conversation._id)
                    setShowConversationList(false)
                  }} className={`cursor-pointer border-b border-gundam-cyan/5 p-4 transition-all hover:bg-gundam-cyan/5 ${activeChat?._id === conversation._id ? 'border-l-2 border-l-gundam-cyan bg-gundam-cyan/10' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-gundam-cyan/20 font-orbitron text-xs text-gundam-cyan">{counterparty?.displayName?.[0] || '?'}</div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold text-white">{counterparty?.displayName || copy.unknown}</span>
                          <span className="text-[9px] font-orbitron text-gundam-text-secondary">{conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                        </div>
                        <p className="truncate text-xs text-gundam-text-secondary">{getConversationPreview(conversation.lastMessage, copy)}</p>
                        {conversation.relatedProduct?.name ? (
                          <p className="mt-2 truncate text-[9px] font-orbitron uppercase tracking-[0.18em] text-gundam-cyan/80">{copy.contextProduct}: {conversation.relatedProduct.name}</p>
                        ) : conversation.relatedTradeListing?.title ? (
                          <p className="mt-2 truncate text-[9px] font-orbitron uppercase tracking-[0.18em] text-gundam-cyan/80">{copy.contextTrade}: {conversation.relatedTradeListing.title}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>
          </div>
        </aside>

        <section className={`${showConversationList && activeChat ? 'hidden md:flex' : 'flex'} relative flex-1 flex-col overflow-hidden bg-black/20`}>
          {activeChat ? (
            <>
              <div className="z-10 flex items-center justify-between gap-3 border-b border-gundam-cyan/10 bg-black/60 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button type="button" onClick={() => setShowConversationList(true)} className="inline-flex h-9 w-9 items-center justify-center rounded border border-gundam-cyan/20 text-gundam-cyan hover:bg-gundam-cyan/10 md:hidden">
                    <ArrowLeft size={16} />
                  </button>
                  <div className="h-3 w-3 rounded-full animate-pulse bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-orbitron uppercase tracking-widest text-white sm:text-base">{getCounterparty(activeChat)?.displayName || copy.unknown}</span>
                    {activeChat.relatedProduct?.name ? (
                      <span className="text-[10px] font-orbitron uppercase tracking-[0.18em] text-gundam-cyan/80">{copy.contextProduct}: {activeChat.relatedProduct.name}</span>
                    ) : activeChat.relatedTradeListing?.title ? (
                      <span className="text-[10px] font-orbitron uppercase tracking-[0.18em] text-gundam-cyan/80">{copy.contextTrade}: {activeChat.relatedTradeListing.title}</span>
                    ) : null}
                  </div>
                </div>
                <button type="button" className="hidden text-[10px] font-orbitron uppercase tracking-widest text-gundam-cyan transition-colors hover:text-white sm:inline-flex">{copy.terminate}</button>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {messages.map((message) => {
                    const own = message.sender?._id === user?._id
                    return (
                      <motion.div key={message._id} initial={{ opacity: 0, x: own ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[92%] sm:max-w-[72%] ${own ? 'order-1' : 'order-2'}`}>
                          <div className={`space-y-3 p-4 shadow-lg ${own ? 'rounded-l-xl rounded-tr-xl bg-gundam-cyan text-black' : 'rounded-r-xl rounded-tl-xl border border-gundam-cyan/30 bg-gundam-dark-surface text-white'}`}>
                            {message.text ? <p className="text-sm leading-relaxed">{message.text}</p> : null}
                            {message.attachments?.length ? <div className="grid gap-3">{message.attachments.map((attachment) => <AttachmentPreview key={attachment.publicId || attachment.url} attachment={attachment} ownMessage={own} />)}</div> : null}
                          </div>
                          <div className={`mt-2 text-[9px] font-orbitron uppercase tracking-tighter text-gundam-text-secondary ${own ? 'text-right' : 'text-left'}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={scrollRef} />
                </div>
              </div>
              <form onSubmit={handleSend} className="border-t border-gundam-cyan/10 bg-black/40 p-4">
                {attachmentFiles.length > 0 ? (
                  <div className="mb-4 rounded-2xl border border-gundam-cyan/15 bg-black/20 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-orbitron uppercase tracking-[0.22em] text-gundam-cyan">{copy.attachments}</span>
                      <span className="text-[10px] text-gundam-text-secondary">{copy.limit}</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {attachmentFiles.map((file, index) => (
                        <div key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-3 rounded-xl border border-gundam-cyan/20 bg-white/5 px-3 py-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gundam-cyan/20 bg-black/20 text-gundam-cyan">
                            {getFileKind(file) === 'image' && <ImagePlus size={16} />}
                            {getFileKind(file) === 'video' && <Video size={16} />}
                            {getFileKind(file) === 'audio' && <AudioLines size={16} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-white">{file.name}</p>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-gundam-text-secondary">{getFileKindLabel(getFileKind(file), copy)} • {formatBytes(file.size)}</p>
                          </div>
                          <button type="button" onClick={() => removeAttachment(index)} className="text-gundam-red hover:text-white"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-gundam-cyan/20 bg-white/5 px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.18em] text-gundam-cyan hover:border-gundam-cyan"><ImagePlus size={14} /> {copy.attach}</button>
                    <button type="button" onClick={handleToggleRecording} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.18em] ${isRecording ? 'border-gundam-red bg-gundam-red/10 text-gundam-red' : 'border-gundam-cyan/20 bg-white/5 text-gundam-cyan hover:border-gundam-cyan'}`}>{isRecording ? <MicOff size={14} /> : <AudioLines size={14} />}{isRecording ? copy.recordStop : copy.record}</button>
                    <button type="button" onClick={handleToggleDictation} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-orbitron uppercase tracking-[0.18em] ${isDictating ? 'border-gundam-amber bg-gundam-amber/10 text-gundam-amber' : 'border-gundam-cyan/20 bg-white/5 text-gundam-cyan hover:border-gundam-cyan'}`}><Mic size={14} />{isDictating ? copy.speechStop : copy.speech}</button>
                    <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*" multiple className="hidden" onChange={handleFileSelection} />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input className="flex-1 rounded-lg border border-gundam-cyan/30 bg-gundam-dark-surface p-4 text-sm text-white outline-none transition-all focus:border-gundam-cyan" placeholder={copy.input} value={newMessage} onChange={(event) => handleTextChange(event.target.value)} />
                    <button type="submit" disabled={sending || (!newMessage.trim() && attachmentFiles.length === 0)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gundam-cyan px-8 py-4 font-orbitron font-bold uppercase tracking-widest text-black shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}
                      {copy.send}
                    </button>
                  </div>
                </div>
              </form>

              <div className="pointer-events-none absolute inset-0 opacity-5">
                <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_40px]" />
                <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:40px_100%]" />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-gundam-text-secondary">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gundam-cyan/20">
                <span className="h-8 w-8 animate-ping rounded-full border border-gundam-cyan/40" />
              </div>
              <p className="text-center text-xs font-orbitron uppercase tracking-[0.3em]">{copy.waiting}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const getConversationPreview = (lastMessage, copy) => {
  if (!lastMessage) return ''
  if (lastMessage.text?.trim()) return lastMessage.text
  if (!lastMessage.attachments?.length) return ''
  const kinds = [...new Set(lastMessage.attachments.map((attachment) => attachment.kind))]
  return kinds.length > 1 ? copy.preview.mixed : (copy.preview[kinds[0]] || copy.preview.mixed)
}

const getFileKindLabel = (kind, copy) => kind === 'video' ? copy.video : kind === 'audio' ? copy.audio : copy.image

const AttachmentPreview = ({ attachment, ownMessage }) => {
  const wrapperClassName = ownMessage ? 'overflow-hidden rounded-2xl border border-black/10 bg-black/10' : 'overflow-hidden rounded-2xl border border-gundam-cyan/20 bg-black/20'
  if (attachment.kind === 'image') {
    return <a href={attachment.url} target="_blank" rel="noreferrer" className={wrapperClassName}><img src={attachment.url} alt={attachment.originalName || 'attachment'} className="max-h-72 w-full object-cover" /></a>
  }
  if (attachment.kind === 'video') {
    return <div className={wrapperClassName}><video src={attachment.url} controls className="max-h-80 w-full bg-black" /></div>
  }
  return <div className={`${wrapperClassName} p-3`}><audio src={attachment.url} controls className="w-full" preload="metadata" /></div>
}

export default ChatConsole
