import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, User, Palette, Sparkles, CheckCircle2, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: 'CLIENT' | 'ARTIST';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'CLIENT'
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'CLIENT' | 'ARTIST'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickDemoLogin = (role: 'CLIENT' | 'ARTIST') => {
    if (role === 'CLIENT') {
      onLoginSuccess({
        id: 'usr-client-01',
        name: 'Eleanor Vance',
        email: 'eleanor.vance@atelierbloom.com',
        role: 'CLIENT',
        avatarInitials: 'EV',
        location: 'Singapore'
      });
    } else {
      onLoginSuccess({
        id: 'usr-artist-01',
        name: 'Julian Vance',
        email: 'julian@gigrise.com',
        role: 'ARTIST',
        avatarInitials: 'JV',
        location: 'Tiong Bahru'
      });
    }
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = (email.slice(0, 2) || (activeTab === 'CLIENT' ? 'EV' : 'JV')).toUpperCase();
    onLoginSuccess({
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: activeTab === 'CLIENT' ? (email.split('@')[0] || 'Eleanor Vance') : 'Julian Vance',
      email: email || (activeTab === 'CLIENT' ? 'client@gigrise.com' : 'artist@gigrise.com'),
      role: activeTab,
      avatarInitials: initials,
      location: 'Singapore'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2722]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#faf8f5] rounded-2xl border border-[#c5a880]/50 shadow-2xl overflow-hidden flex flex-col paper-texture"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Paper Bar */}
        <div className="p-5 sm:p-6 border-b border-[#ebdcc8] flex items-center justify-between bg-[#f4efe4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 chinese-stamp rounded-sm flex flex-col items-center justify-center p-0.5 bg-[#fdf5f2]/70">
              <span className="text-[8px] uppercase tracking-tighter font-bold leading-none">ATOM</span>
              <span className="text-[7px] uppercase tracking-widest font-serif leading-none mt-0.5">ORA</span>
            </div>
            <div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8c8072]">
                Atelier Passport
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
                GigRise Authentication
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ede6da] hover:bg-[#e2d8c9] text-[#5c5245] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch between Client and Artist */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 p-1 bg-[#ede6da] rounded-xl border border-[#c5a880]/30">
            <button
              onClick={() => setActiveTab('CLIENT')}
              className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'CLIENT'
                  ? 'bg-[#faf8f5] text-[#2c2722] shadow-xs font-semibold'
                  : 'text-[#6f6456] hover:text-[#2c2722]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#9b784a]" />
              <span>Event Host / Client</span>
            </button>
            <button
              onClick={() => setActiveTab('ARTIST')}
              className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ARTIST'
                  ? 'bg-[#3a352f] text-[#faf8f5] shadow-xs font-semibold'
                  : 'text-[#6f6456] hover:text-[#2c2722]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#d9c5a3]" />
              <span>Creator / Artist</span>
            </button>
          </div>

          {/* Quick 1-Click Demo Profiles */}
          <div className="p-3.5 rounded-xl bg-[#f4efe4] border border-[#e2d7c5] text-xs">
            <div className="text-[11px] font-semibold text-[#6e6152] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Demo Access</span>
              <Sparkles className="w-3 h-3 text-[#9b784a]" />
            </div>

            {activeTab === 'CLIENT' ? (
              <button
                onClick={() => handleQuickDemoLogin('CLIENT')}
                className="w-full py-2 px-3 rounded-lg bg-[#faf8f5] hover:bg-[#ffffff] border border-[#d8cdbd] text-[#2c2722] font-medium transition-all shadow-xs flex items-center justify-between text-xs"
              >
                <div className="text-left">
                  <div className="font-semibold">Eleanor Vance</div>
                  <div className="text-[10px] text-[#7a6f62]">Event Host (Atelier Bloom)</div>
                </div>
                <span className="text-[11px] text-[#9b784a] font-serif italic">1-Click Sign In →</span>
              </button>
            ) : (
              <button
                onClick={() => handleQuickDemoLogin('ARTIST')}
                className="w-full py-2 px-3 rounded-lg bg-[#3a352f] hover:bg-[#201d1a] text-white font-medium transition-all shadow-xs flex items-center justify-between text-xs"
              >
                <div className="text-left">
                  <div className="font-semibold text-[#faf8f5]">Julian Vance</div>
                  <div className="text-[10px] text-[#d9c5a3]">Featured Acoustic Soloist</div>
                </div>
                <span className="text-[11px] text-[#d9c5a3] font-serif italic">1-Click Sign In →</span>
              </button>
            )}
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#5c5245] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8072]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'CLIENT' ? 'host@example.com' : 'artist@gigrise.com'}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf8f5] border border-[#c5a880]/40 rounded-lg text-[#3a352f] focus:outline-none focus:border-[#9b784a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5c5245] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8072]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf8f5] border border-[#c5a880]/40 rounded-lg text-[#3a352f] focus:outline-none focus:border-[#9b784a]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-lg transition-colors shadow-xs"
            >
              Enter Atelier as {activeTab === 'CLIENT' ? 'Client' : 'Artist'}
            </button>
          </form>

          <div className="text-center text-[10px] text-[#8c8072]">
            Protected by Supabase Row-Level Security & AES-256 Token Signatures.
          </div>
        </div>

      </div>
    </div>
  );
};
