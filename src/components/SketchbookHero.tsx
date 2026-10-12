import React, { useState } from 'react';
import { Artist } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Music, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface SketchbookHeroProps {
  artists: Artist[];
  onSelectArtistForBooking: (artist: Artist) => void;
  onExploreDirectory: () => void;
}

export const SketchbookHero: React.FC<SketchbookHeroProps> = ({
  artists,
  onSelectArtistForBooking,
  onExploreDirectory
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 50, y: 50 });
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const artist = artists[currentIndex] || artists[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? artists.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === artists.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnifierActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMagnifierPos({ x, y });
  };

  return (
    <section id="hero" className="relative py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Editorial Subtitle Kicker */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#7a6f61]">
          <span>Chapter 01</span>
          <span className="text-[#c5a880]">·</span>
          <span>The Artisanal Sketchbook</span>
          <span className="text-[#c5a880]">·</span>
          <span>Featured Soloists & Painters</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2c2722] mt-2 font-medium tracking-tight">
          Handcrafted Moments for Private Gatherings
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#6f665a] max-w-2xl mx-auto font-sans leading-relaxed">
          Step inside our curated journal of verified acoustic soloists, jazz saxophonists, live heirloom painters, and classical string virtuosos.
        </p>
      </div>

      {/* The Physical Open Two-Page Sketchbook */}
      <div className="relative mx-auto max-w-5xl">
        
        {/* Navigation Arrows on Left and Right of the book */}
        <button
          onClick={handlePrev}
          aria-label="Previous artist page"
          className="absolute -left-3 sm:-left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#faf8f5]/90 border border-[#c5a880]/40 text-[#4a4237] hover:text-[#1f1b16] hover:bg-[#ffffff] shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next artist page"
          className="absolute -right-3 sm:-right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#faf8f5]/90 border border-[#c5a880]/40 text-[#4a4237] hover:text-[#1f1b16] hover:bg-[#ffffff] shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Physical Sketchbook Container */}
        <div className="relative rounded-2xl bg-[#f7f5ef] p-2 sm:p-4 shadow-2xl border border-[#d6cbbd]/60">
          
          {/* Deckle Edge Paper Spread */}
          <div className="relative bg-[#faf8f5] rounded-xl overflow-hidden border border-[#e4dcce] shadow-inner grid grid-cols-1 md:grid-cols-2 min-h-[540px] md:min-h-[580px]">
            
            {/* Center Spine Crease & Shadow overlay */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 z-20 pointer-events-none sketchbook-spine opacity-75" />

            {/* ================= LEFT PAGE: ARTIST JOURNAL & NOTES ================= */}
            <div className="relative p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#ebdcc8]/50 paper-texture">
              
              {/* Vintage Washi Tape Top Accent */}
              <div className="absolute -top-1 left-10 w-28 h-7 bg-[#dfd6c6]/80 rotate-[-2deg] border border-[#d1c6b3]/50 shadow-xs z-10 pointer-events-none backdrop-blur-xs flex items-center justify-center">
                <span className="text-[10px] font-sans tracking-widest text-[#726759] uppercase opacity-75">
                  Studio Entry
                </span>
              </div>

              {/* Top Meta: Chapter & City */}
              <div>
                <div className="flex items-center justify-between mt-2 pt-2 text-xs font-sans tracking-widest text-[#8c8072] uppercase">
                  <span>Plate 0{currentIndex + 1} of 0{artists.length}</span>
                  <span className="flex items-center gap-1 text-[#6a5e50]">
                    <MapPin className="w-3 h-3 text-[#9b784a]" />
                    {artist.location}
                  </span>
                </div>

                {/* Artist Name & Category */}
                <div className="mt-6">
                  <span className="text-xs font-sans tracking-wider text-[#9b784a] uppercase font-semibold">
                    {artist.category}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-[#2c2722] font-semibold mt-1">
                    {artist.name}
                  </h3>
                  <div className="text-xs text-[#7e7365] font-sans mt-0.5 tracking-wide">
                    {artist.genre}
                  </div>
                </div>

                {/* Handwritten Artist Quote */}
                <div className="mt-5 p-4 rounded-lg bg-[#f4efe4]/70 border border-[#e0d6c5] relative">
                  <div className="text-sm sm:text-base font-serif italic text-[#3c362f] leading-relaxed">
                    {artist.handwrittenQuote}
                  </div>
                  <div className="text-right text-[11px] text-[#867a6d] font-sans uppercase tracking-widest mt-2">
                    — Journal Notes, 2026
                  </div>
                </div>

                {/* Bio text */}
                <p className="mt-4 text-xs sm:text-sm text-[#5d5449] leading-relaxed font-sans">
                  {artist.bio}
                </p>

                {/* Repertoire Preview */}
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#867a6d] mb-1.5 flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-[#9b784a]" />
                    <span>Signature Repertoire</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs text-[#4a4237]">
                    {artist.repertoire.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="bg-[#ede7da] px-2.5 py-0.5 rounded text-[11px] font-sans border border-[#ddd3c1]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Left Page: Red Artisan Seal Stamp & Escrow Stamp */}
              <div className="mt-8 pt-4 border-t border-[#ebdcc8] flex flex-wrap items-center justify-between gap-3">
                
                {/* Traditional Red Artisan Seal Stamp (like Meng To's screenshot) */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 chinese-stamp rounded-sm flex flex-col items-center justify-center p-0.5 bg-[#fdf5f2]/60 select-none shadow-xs">
                    <span className="text-[8px] uppercase tracking-tighter font-bold leading-none">ATOM</span>
                    <span className="text-[7px] uppercase tracking-widest font-serif leading-none mt-0.5">ORA</span>
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-[#84786a] uppercase">
                    VERIFIED · 2026<br/>
                    ESCROW SHIELD
                  </div>
                </div>

                {/* Fair Price & Action */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-[#867a6d] uppercase tracking-wider">AI Fair Rate</div>
                    <div className="text-base font-serif font-bold text-[#2c2722]">
                      ${artist.baseHourlyRate}<span className="text-xs font-sans font-normal text-[#756a5c]">/hr</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectArtistForBooking(artist)}
                    className="px-4 py-2 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-md transition-all duration-200 shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Reserve</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#d9c5a3]" />
                  </button>
                </div>

              </div>

            </div>

            {/* ================= RIGHT PAGE: WATERCOLOR SKETCHWORK ================= */}
            <div 
              className="relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-[#faf8f5]"
              onMouseMove={handleMouseMove}
            >
              
              {/* Interactive Tool Ribbon: Magnifier Lens & Sound Audition */}
              <div className="flex items-center justify-between z-20 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMagnifierActive(!isMagnifierActive)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans transition-all duration-200 border ${
                      isMagnifierActive
                        ? 'bg-[#c5a880] text-[#faf8f5] border-[#b09267] shadow-xs'
                        : 'bg-[#faf8f5]/90 text-[#6a5e50] border-[#d8cdbd] hover:bg-[#ede5d6]'
                    }`}
                  >
                    <Search className="w-3 h-3" />
                    <span>{isMagnifierActive ? 'Lens Active' : 'Magnify Sketch'}</span>
                  </button>

                  <button
                    onClick={() => setIsPlayingSample(!isPlayingSample)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans transition-all duration-200 border ${
                      isPlayingSample
                        ? 'bg-[#4d7350] text-[#faf8f5] border-[#3e5f41] shadow-xs'
                        : 'bg-[#faf8f5]/90 text-[#6a5e50] border-[#d8cdbd] hover:bg-[#ede5d6]'
                    }`}
                  >
                    {isPlayingSample ? <Volume2 className="w-3 h-3 animate-pulse" /> : <VolumeX className="w-3 h-3" />}
                    <span>{isPlayingSample ? 'Audio Playing (Acoustic)' : 'Audition'}</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono tracking-widest text-[#8c8072] uppercase">
                  NOV 12 2026
                </div>
              </div>

              {/* The Art Sketch Display */}
              <div className="relative flex-1 rounded-lg overflow-hidden border border-[#dcd1c2] shadow-sm bg-[#f2eee6] group min-h-[300px]">
                
                {/* Fallback image container with styling */}
                <img
                  src={artist.sketchImage}
                  alt={`Hand-painted watercolor sketch of ${artist.name}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover watercolor-filter transition-transform duration-700 group-hover:scale-102"
                />

                {/* Vintage paper texture overlay wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c2722]/30 via-transparent to-transparent pointer-events-none" />

                {/* Brass Magnifying Glass Circle (Modeled after screenshot 1 & 2) */}
                {isMagnifierActive && (
                  <div
                    className="absolute pointer-events-none w-36 h-36 rounded-full border-4 border-[#b59972] shadow-2xl overflow-hidden z-30 transition-transform duration-75"
                    style={{
                      left: `calc(${magnifierPos.x}% - 72px)`,
                      top: `calc(${magnifierPos.y}% - 72px)`,
                      backgroundImage: `url(${artist.sketchImage})`,
                      backgroundSize: '280% 280%',
                      backgroundPosition: `${magnifierPos.x}% ${magnifierPos.y}%`,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.35), inset 0 0 15px rgba(181, 153, 114, 0.4)'
                    }}
                  >
                    {/* Glass reflection gradient highlight */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/40 pointer-events-none" />
                  </div>
                )}

                {/* Bottom title overlay on painting */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#faf8f5] z-10 pointer-events-none">
                  <div className="bg-[#2c2722]/80 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-sans tracking-wide">
                    {artist.category} · {artist.instruments.join(', ')}
                  </div>
                  <div className="bg-[#2c2722]/80 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono">
                    ★ {artist.rating.toFixed(2)} ({artist.reviewCount})
                  </div>
                </div>

              </div>

              {/* Bottom Quick Controls & Directory Link */}
              <div className="mt-4 flex items-center justify-between text-xs font-sans text-[#73675a]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5a7f5e]" />
                  <span>Cancel-Proof Shield Active (15% Bonus)</span>
                </div>
                <button
                  onClick={onExploreDirectory}
                  className="text-xs font-serif italic text-[#9b784a] hover:text-[#5d4628] hover:underline"
                >
                  Browse all artists →
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
