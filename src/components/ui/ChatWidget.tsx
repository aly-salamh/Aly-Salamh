import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { getChatResponse } from '../../services/geminiService';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: 'Welcome to The Cairo Code. I am your fashion intelligence assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages as any);
    setLoading(true);

    try {
      const response = await getChatResponse(newMessages as any, 'b2c');
      setMessages([...newMessages, { role: 'model', content: response || 'Sorry, I am having trouble thinking right now.' }] as any);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', content: 'I encountered an error. Please try again.' }] as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat-widget" className="fixed bottom-8 right-8 z-[1001]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-brand-white rounded-2xl shadow-2xl border border-black/5 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-black p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-red rounded-lg">
                  <Sparkles size={18} className="text-brand-white" />
                </div>
                <div>
                  <h4 className="text-brand-white font-display text-sm">CAIRO CODE AI</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-brand-white/40 uppercase tracking-widest">Fashion Intelligence Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-brand-white/40 hover:text-brand-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-4 bg-brand-white-98"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-brand-red text-brand-white rounded-tr-none' 
                      : 'bg-brand-white border border-black/5 text-brand-black rounded-tl-none shadow-sm'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                       {m.role === 'user' ? <User size={12} /> : <Bot size={12} className="text-brand-red" />}
                       <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                         {m.role === 'user' ? 'You' : 'Assistant'}
                       </span>
                    </div>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-brand-black/5 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-brand-red" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-black-40">Typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-brand-white border-t border-black/5">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ask about brands, style, or Cairo fashion..."
                  className="w-full bg-brand-white-95 border-none p-4 pr-12 rounded-xl text-sm focus:ring-1 focus:ring-brand-red"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-red text-brand-white rounded-lg hover:bg-brand-red-light transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[8px] text-center mt-3 font-bold text-brand-black-40 uppercase tracking-widest">
                Powered by Cairo Fashion Intelligence SS26
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-black text-brand-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-brand-red translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        {isOpen ? <X size={24} className="relative z-10" /> : <MessageCircle size={24} className="relative z-10" />}
      </motion.button>
    </div>
  );
}
