import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  Coins, 
  Music,
  Minus
} from 'lucide-react';

interface AiConciergeChatProps {
  onSelectArtistByName?: (name: string) => void;
  onOpenFinancing?: () => void;
}

export const AiConciergeChat: React.FC<AiConciergeChatProps> = ({
  onSelectArtistByName,
  onOpenFinancing
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Greetings. I am the GigRise Atelier Concierge. How may I assist you with artist matchmaking, our Cancel-Proof Shield, 3-Step Escrow, or GigCredit BNPL financing today?',
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    'How does the Cancel-Proof Shield work?',
    'Explain GigCredit BNPL terms',
    'Recommend an artist for a garden wedding',
    'How do I apply for Advance Financing?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Check if GEMINI_API_KEY is available in the environment
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are the GigRise Atelier Concierge for GigRise by ATOMORA, an artisanal digital sketchbook marketplace for local event artists in Singapore.
Key knowledge:
- Cancel-Proof Shield: If client cancels < 7 days, artist keeps 20% advance + 15% guaranteed bonus from Shield Pool ($48,250 reserve).
- AI Fair Price: Zero bargaining algorithm, transparent rates.
- 3-Step Escrow: 1. 20% Advance held in vault -> 2. Artist GPS Geo Check-In (within 250m) -> 3. Client reveals 6-digit OTP after performance to release 80% balance.
- GigCredit (BNPL): 20% downpayment today, 3 equal monthly EMIs with 1.5% interest.
- Advance Financing: For lower financial condition clients (from 2.2% APR to 3.8% APR).
- Featured artists: Julian Vance (Acoustic Soloist, $160/hr), Miles Chen (Jazz Saxophone, $220/hr), Clara Delacroix (Live Painting, $250/hr), Seraphina Lin (Classical Violin, $190/hr).
Respond in an elegant, warm, poetic yet concise editorial tone fitting an artisanal sketchbook.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nUser Question: ${text}`
        });

        const reply = response.text || "I am at your service to curate your event acoustics.";
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        // High fidelity domain-native fallback reply
        setTimeout(() => {
          let reply = "I am delighted to assist you with our curated artists and trust infrastructure.";
          const lower = text.toLowerCase();
          if (lower.includes('shield') || lower.includes('cancel')) {
            reply = "🛡️ **Cancel-Proof Shield**: If an event host cancels under 7 days before the event, the artist retains their 20% advance AND receives an additional 15% bonus payout funded from our $48,250 community reserve. If cancelled 7+ days in advance, the client receives a full refund.";
          } else if (lower.includes('bnpl') || lower.includes('gigcredit') || lower.includes('emi')) {
            reply = "💳 **GigCredit (BNPL)**: Allows you to secure any artist with just 20% downpayment today. The remaining balance is split across 3 monthly installments at a low 1.5% monthly flat interest rate, making milestone celebrations accessible.";
          } else if (lower.includes('wedding') || lower.includes('recommend') || lower.includes('artist')) {
            reply = "✨ For an intimate garden gathering, I highly recommend **Julian Vance** (Indie Folk Acoustic) or **Clara Delacroix** (Live Impressionist Oil Painting). Both hold 5-star ratings and are fully verified under our 3-Step Escrow.";
          } else if (lower.includes('advance') || lower.includes('financing') || lower.includes('loan')) {
            reply = "🌿 **Advance Financing**: For clients facing tight liquidity, we offer micro-advances from 2.2% to 3.8% APR based on your financial tier (Grassroots, Student, Family, or Micro-business). Tap 'Advance Credit' at the top to compute your custom payment schedule.";
          }

          setMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: reply,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }, 600);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "Our Cancel-Proof Shield guarantees 20% advance + 15% bonus on last-minute cancellations, and GigCredit lets you pay in 3 easy EMIs at 1.5% interest.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside aria-label="AI Concierge Assistant" className="fixed bottom-6 right-6 z-40 select-none">
      
      {/* Floating Trigger Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#3a352f] text-[#faf8f5] shadow-xl hover:bg-[#201d1a] border border-[#c5a880]/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-[#c5a880]/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#d9c5a3]" />
          </div>
          <span className="text-xs font-serif font-medium tracking-wide">
            Atelier AI Concierge
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-[#faf8f5] border border-[#c5a880]/50 shadow-2xl flex flex-col overflow-hidden paper-texture animate-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#f4efe4] border-b border-[#ebdcc8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#3a352f] text-[#faf8f5] flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-[#d9c5a3]" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-semibold text-[#2c2722]">
                  The Atelier Concierge
                </h4>
                <div className="text-[10px] text-[#7a6f62] font-sans">
                  AI Matchmaker & Escrow Guide
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#7a6f62] hover:text-[#2c2722] rounded-full hover:bg-[#ede5d6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf8f5]/80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[#c5a880]/40 flex items-center justify-center text-[10px] font-serif font-bold shrink-0 mt-0.5">
                    GR
                  </div>
                )}
                
                <div
                  className={`max-w-[82%] p-3 rounded-xl text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#3a352f] text-[#faf8f5] rounded-tr-none'
                      : 'bg-[#f4efe4] text-[#3a352f] rounded-tl-none border border-[#e2d7c5]'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-white/60' : 'text-[#8c8072]'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#8c8072] italic pl-8">
                <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-bounce" />
                <span>Consulting the artist registry...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-[#f4efe4] border-t border-[#ebdcc8] flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 bg-[#faf8f5] hover:bg-[#eae3d5] rounded-full border border-[#d6c9b5] text-[#554b3f] whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#faf8f5] border-t border-[#ebdcc8] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about artists, escrow, BNPL..."
              className="flex-1 px-3 py-2 text-xs bg-[#f4efe4] border border-[#c5a880]/40 rounded-lg text-[#3a352f] focus:outline-none focus:border-[#9b784a] placeholder-[#9c9183]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="w-8 h-8 rounded-lg bg-[#3a352f] disabled:opacity-40 text-[#faf8f5] flex items-center justify-center hover:bg-[#1f1c19] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </aside>
  );
};
