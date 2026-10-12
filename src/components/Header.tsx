import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, User, Palette, ShieldCheck, Database, LogOut } from 'lucide-react';

interface HeaderProps {
  currentMode: 'CLIENT' | 'ARTIST';
  onToggleMode: (mode: 'CLIENT' | 'ARTIST') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSchema: () => void;
  onOpenFinancing: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onToggleMode,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSchema,
  onOpenFinancing,
  activeSection,
  onNavigate
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f4f3ee]/90 backdrop-blur-md border-b border-[#c5a880]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar with 3 clean zones */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Mode Switcher on Left */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-[#eae6df] rounded-full border border-[#c5a880]/30 shadow-inner">
              <button
                onClick={() => onToggleMode('CLIENT')}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  currentMode === 'CLIENT'
                    ? 'bg-[#faf8f5] text-[#3a352f] shadow-sm font-semibold'
                    : 'text-[#6a6258] hover:text-[#3a352f]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#9b784a]" />
                <span>Client Mode</span>
              </button>
              <button
                onClick={() => onToggleMode('ARTIST')}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  currentMode === 'ARTIST'
                    ? 'bg-[#3a352f] text-[#faf8f5] shadow-sm font-semibold'
                    : 'text-[#6a6258] hover:text-[#3a352f]'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-[#d9c5a3]" />
                <span>Artist Mode</span>
              </button>
            </div>
            {currentMode === 'CLIENT' && (
              <button
                onClick={onOpenFinancing}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#7a5c36] bg-[#eae3d5]/70 hover:bg-[#e4dcce] border border-[#c5a880]/40 rounded-full transition-colors"
                title="Micro-advances for event hosts"
              >
                <Sparkles className="w-3 h-3 text-[#9b784a]" />
                <span>Advance Credit</span>
              </button>
            )}
          </div>

          {/* Centered Brand Title in Playfair Display serif */}
          <div className="text-center order-first md:order-none">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('hero');
              }}
              className="group inline-block focus:outline-none"
            >
              <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#2c2722] font-semibold group-hover:text-[#6a5438] transition-colors">
                GigRise <span className="text-sm tracking-widest font-sans font-light uppercase text-[#8c7f70] ml-1">By ATOMORA</span>
              </h1>
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#8c7f70] mt-0.5">
                Artisanal Sketchbook & Local Artist Escrow
              </p>
            </a>
          </div>

          {/* Right Action: Architecture & Auth */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSchema}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5a5247] hover:text-[#2c2722] bg-[#faf8f5] hover:bg-[#f1ede5] border border-[#c5a880]/40 rounded-md transition-colors"
              title="View Supabase Schema & Server Architecture"
            >
              <Database className="w-3.5 h-3.5 text-[#9b784a]" />
              <span className="hidden sm:inline">Supabase Schema</span>
              <span className="sm:hidden">SQL</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#c5a880]/30">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-[#2c2722] truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#8c7f70] uppercase tracking-wider">
                    {currentUser.role === 'CLIENT' ? 'Event Host' : 'Verified Artist'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3a352f] text-[#faf8f5] flex items-center justify-center font-serif text-xs font-bold shadow-sm">
                  {currentUser.avatarInitials}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-[#8c7f70] hover:text-[#9b3a32] rounded hover:bg-[#eae4d9] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-1.5 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#282420] rounded-md transition-colors shadow-sm tracking-wide"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Minimalist Sub-Nav in Sketchbook Style */}
        <nav className="mt-3 pt-3 border-t border-[#c5a880]/15 flex items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-[#6e6457]">
          <button
            onClick={() => onNavigate('hero')}
            className={`transition-colors pb-0.5 hover:text-[#2c2722] ${
              activeSection === 'hero' ? 'text-[#2c2722] border-b-2 border-[#9b784a]' : ''
            }`}
          >
            Sketchbook
          </button>
          
          <button
            onClick={() => onNavigate('trust')}
            className={`transition-colors pb-0.5 hover:text-[#2c2722] ${
              activeSection === 'trust' ? 'text-[#2c2722] border-b-2 border-[#9b784a]' : ''
            }`}
          >
            Trust Shield & Escrow
          </button>

          {currentMode === 'CLIENT' ? (
            <>
              <button
                onClick={() => onNavigate('directory')}
                className={`transition-colors pb-0.5 hover:text-[#2c2722] ${
                  activeSection === 'directory' ? 'text-[#2c2722] border-b-2 border-[#9b784a]' : ''
                }`}
              >
                Artist Directory
              </button>
              <button
                onClick={onOpenFinancing}
                className="transition-colors pb-0.5 hover:text-[#2c2722] text-[#85653b]"
              >
                Advance Financing
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('studio')}
                className={`transition-colors pb-0.5 hover:text-[#2c2722] ${
                  activeSection === 'studio' ? 'text-[#2c2722] border-b-2 border-[#9b784a]' : ''
                }`}
              >
                Creator Studio
              </button>
              <button
                onClick={() => onNavigate('leads')}
                className="transition-colors pb-0.5 hover:text-[#2c2722]"
              >
                B2B Planner Leads
              </button>
              <button
                onClick={() => onNavigate('whatsapp-bot')}
                className="transition-colors pb-0.5 hover:text-[#2c2722] text-[#4d7350]"
              >
                WhatsApp Bot
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
