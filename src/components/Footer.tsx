import React from 'react';
import { Database, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenSchema: () => void;
  onOpenFinancing: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSchema,
  onOpenFinancing
}) => {
  return (
    <footer className="mt-20 border-t border-[#c5a880]/30 bg-[#f4f3ee] relative overflow-hidden py-14 px-4 sm:px-6 lg:px-8 text-center">
      
      {/* Soft watercolor splash accent under text (like Meng To's screenshot 3) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-96 h-12 bg-[#dfd3bf]/30 blur-xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Brand Mark */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 chinese-stamp rounded-sm flex flex-col items-center justify-center p-0.5 bg-[#fdf5f2]/70 select-none shadow-xs">
            <span className="text-[7px] uppercase tracking-tighter font-bold leading-none">ATOM</span>
            <span className="text-[6px] uppercase tracking-widest font-serif leading-none mt-0.5">ORA</span>
          </div>
          <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
            GigRise <span className="text-xs uppercase tracking-widest font-sans font-light text-[#8c7f70]">By ATOMORA</span>
          </h3>
        </div>

        {/* Minimalist Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sans text-[#6f6456]">
          <a href="#hero" className="hover:text-[#2c2722] transition-colors">
            Featured Artists
          </a>
          <span>·</span>
          <a href="#trust" className="hover:text-[#2c2722] transition-colors">
            Cancel-Proof Shield
          </a>
          <span>·</span>
          <a href="#directory" className="hover:text-[#2c2722] transition-colors">
            3-Step Escrow Ledger
          </a>
          <span>·</span>
          <button onClick={onOpenFinancing} className="hover:text-[#2c2722] transition-colors text-[#8c6735]">
            Advance Financing (Micro-Credit)
          </button>
          <span>·</span>
          <button onClick={onOpenSchema} className="hover:text-[#2c2722] transition-colors flex items-center gap-1">
            <Database className="w-3 h-3 text-[#9b784a]" />
            <span>Supabase Schema & Architecture</span>
          </button>
        </div>

        {/* Tracked-out Minimalist Monograph Signature (from Meng To's screenshot) */}
        <div className="pt-4 border-t border-[#ebdcc8]/60 text-xs font-mono tracking-[0.25em] text-[#867a6d] uppercase">
          SINGAPORE · SKETCHBOOK · <span className="font-semibold text-[#2c2722]">HELLO@GIGRISE.ATOMORA.COM</span>
        </div>

        <div className="text-[11px] text-[#9c9183] font-sans">
          © 2026 GigRise by ATOMORA. Crafted with watercolor warmth, zero-bargaining ethics, and cryptographic escrow.
        </div>
      </div>
    </footer>
  );
};
