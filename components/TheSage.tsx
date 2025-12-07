import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, X, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { streamChatResponse, analyzeImage } from '../services/geminiService';

const TheSage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Welcome to your garden. I am The Sage. How is your spirit blossoming today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));

    try {
      if (selectedImage) {
        const analysis = await analyzeImage(selectedImage, userMsg.text);
        const modelMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: analysis,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);
        setSelectedImage(null);
        setIsLoading(false);
      } else {
        let accumulatedText = "";
        const tempId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: tempId,
            role: 'model',
            text: "",
            timestamp: new Date(),
            isThinking: true
        }]);

        await streamChatResponse(historyForApi, userMsg.text, (chunk) => {
            accumulatedText += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === tempId 
                ? { ...msg, text: accumulatedText, isThinking: false } 
                : msg
            ));
        });
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 overflow-hidden shadow-xl my-4">
      {/* Header */}
      <div className="p-5 bg-white/60 border-b border-white/40 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full border border-white/40 shadow-sm">
            <Sparkles className="w-5 h-5 text-lumina-rose" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-lumina-highlight tracking-wide">The Sage</h3>
            <p className="text-xs text-lumina-soft uppercase tracking-widest font-bold">Health Guide</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-5 text-sm md:text-base leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-lumina-rose to-pink-300 text-white rounded-[2rem] rounded-tr-sm'
                  : 'bg-white text-lumina-highlight border border-white/60 rounded-[2rem] rounded-tl-sm'
              }`}
            >
              {msg.isThinking ? (
                 <div className="flex items-center gap-2 text-sm text-lumina-soft font-serif italic">
                    <Loader2 className="w-4 h-4 animate-spin" /> Divining answer...
                 </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/40">
        {selectedImage && (
            <div className="relative inline-block mb-3 ml-2">
                <img src={selectedImage} alt="Upload preview" className="h-24 w-auto rounded-xl border border-white/40 shadow-lg" />
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-lumina-rose text-white rounded-full p-1.5 shadow-md hover:bg-rose-400 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        )}
        
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-lumina-highlight/40 hover:text-lumina-rose hover:bg-white rounded-full transition-colors"
            title="Analyze Image"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedImage ? "Ask about this image..." : "Whisper to The Sage..."}
            className="flex-1 bg-white text-lumina-highlight placeholder-lumina-soft border border-white/50 rounded-full px-6 py-4 focus:outline-none focus:ring-1 focus:ring-lumina-rose/50 transition-all shadow-inner"
          />
          
          <button
            onClick={handleSend}
            disabled={isLoading || (!input && !selectedImage)}
            className="p-4 bg-lumina-rose text-white rounded-full hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-200 transform hover:scale-105 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheSage;