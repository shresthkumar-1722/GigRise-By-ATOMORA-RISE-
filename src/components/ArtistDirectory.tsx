import React, { useState, useMemo } from 'react';
import { Artist } from '../types';
import { 
  MapPin, 
  Star, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sparkles, 
  CreditCard,
  LayoutList,
  LayoutGrid,
  Check,
  Calendar,
  Music
} from 'lucide-react';

interface ArtistDirectoryProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
  onOpenFinancing: () => void;
}

export const ArtistDirectory: React.FC<ArtistDirectoryProps> = ({
  artists,
  onSelectArtist,
  onOpenFinancing
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'nearby' | 'topRated'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'chapterList' | 'cards'>('chapterList');
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);

  const categories = [
    'All',
    'Acoustic Soloist',
    'Jazz & Blues',
    'Live Painting',
    'Classical Strings'
  ];

  // Filter and sort
  const filteredArtists = useMemo(() => {
    let result = artists.filter((a) => {
      const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'nearby') {
      result.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    } else if (sortBy === 'topRated') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [artists, selectedCategory, sortBy, searchQuery]);

  return (
    <section id="directory" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#c5a880]/30">
        <div>
          <div className="text-xs font-sans tracking-[0.2em] uppercase text-[#7a6f61]">
            Chapter 02 · Smart Directory
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#2c2722] font-semibold mt-1">
            Curated Artisans & Soloists
          </h2>
          <p className="text-xs sm:text-sm text-[#6f665a] mt-1 font-sans">
            Every artist is vetted for punctuality, verified with the Cancel-Proof Shield, and supports GigCredit BNPL.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex p-1 bg-[#ede6da] rounded-lg border border-[#c5a880]/30">
            <button
              onClick={() => setViewMode('chapterList')}
              className={`p-1.5 rounded text-xs font-sans flex items-center gap-1.5 transition-colors ${
                viewMode === 'chapterList' ? 'bg-[#faf8f5] text-[#2c2722] shadow-xs font-semibold' : 'text-[#6a6053]'
              }`}
              title="Chapter Ledger Style (Meng To Journal View)"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chapter Ledger</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs font-sans flex items-center gap-1.5 transition-colors ${
                viewMode === 'cards' ? 'bg-[#faf8f5] text-[#2c2722] shadow-xs font-semibold' : 'text-[#6a6053]'
              }`}
              title="Artisanal Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sketch Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Primary Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        
        {/* Search input styled like fine stationery */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8072]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by artist, instrument, genre, or district..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#c5a880]/40 rounded-lg text-xs sm:text-sm text-[#3a352f] placeholder-[#9c9183] focus:outline-none focus:border-[#9b784a] shadow-xs transition-colors"
          />
        </div>

        {/* Sort Filter: Nearby vs Top Rated */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-[#ede6da] rounded-lg border border-[#c5a880]/30">
            <button
              onClick={() => setSortBy('nearby')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                sortBy === 'nearby'
                  ? 'bg-[#faf8f5] text-[#2c2722] shadow-xs font-semibold'
                  : 'text-[#6a6053] hover:text-[#2c2722]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#9b784a]" />
              <span>📍 Nearby First</span>
            </button>
            <button
              onClick={() => setSortBy('topRated')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                sortBy === 'topRated'
                  ? 'bg-[#faf8f5] text-[#2c2722] shadow-xs font-semibold'
                  : 'text-[#6a6053] hover:text-[#2c2722]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[#9b784a]" />
              <span>⭐ Top Rated</span>
            </button>
          </div>
        </div>

      </div>

      {/* Category Pills with Unboxed / Refined Style */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 text-xs font-sans rounded-full whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-[#3a352f] text-[#faf8f5] border-[#3a352f] shadow-xs font-medium'
                : 'bg-[#faf8f5] text-[#63594c] border-[#d8cdbd] hover:bg-[#ede5d6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ================= VIEW 1: CHAPTER LEDGER (MENG TO SCREENSHOT 3 STYLE) ================= */}
      {viewMode === 'chapterList' && (
        <div className="paper-card rounded-xl border border-[#c5a880]/30 overflow-hidden shadow-sm bg-[#faf8f5]">
          <div className="divide-y divide-[#ebdcc8]">
            {filteredArtists.length === 0 ? (
              <div className="p-12 text-center text-[#7e7365]">
                <p className="font-serif text-lg">No artisans matched your current search filters.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-3 text-xs text-[#9b784a] underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredArtists.map((artist, idx) => {
                const isHovered = hoveredArtistId === artist.id;
                return (
                  <div
                    key={artist.id}
                    onMouseEnter={() => setHoveredArtistId(artist.id)}
                    onMouseLeave={() => setHoveredArtistId(null)}
                    onClick={() => onSelectArtist(artist)}
                    className={`p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all duration-200 group ${
                      isHovered ? 'bg-[#f4efe4]' : 'bg-[#faf8f5]'
                    }`}
                  >
                    {/* Left: Index & Name & Category */}
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                      <span className="font-mono text-xs sm:text-sm text-[#9c8e7e] w-6 shrink-0 mt-1 sm:mt-0">
                        0{idx + 1}
                      </span>
                      
                      {/* Artist Thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#d6c9b5] shrink-0 bg-[#eee7db]">
                        <img
                          src={artist.sketchImage}
                          alt={artist.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover watercolor-filter"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg sm:text-xl font-serif font-semibold text-[#2c2722] group-hover:text-[#6a5438] transition-colors">
                            {artist.name}
                          </h4>
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#ebd7bf]/60 text-[#7a5828] border border-[#d6bfa3]">
                            AI Fair Price
                          </span>
                        </div>
                        <div className="text-xs text-[#6e6355] font-sans mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{artist.category}</span>
                          <span className="text-[#c5a880]">·</span>
                          <span className="italic font-serif">{artist.genre}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Location & Rating */}
                    <div className="flex items-center gap-6 text-xs text-[#5f5446] pl-10 md:pl-0">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#9b784a]" />
                        <span>{artist.location}</span>
                        <span className="text-[#8c8072] font-mono">({artist.distanceKm} km)</span>
                      </div>

                      <div className="flex items-center gap-1 font-mono">
                        <Star className="w-3.5 h-3.5 fill-[#c5a880] text-[#c5a880]" />
                        <span className="font-bold text-[#2c2722]">{artist.rating.toFixed(2)}</span>
                        <span className="text-[#8c8072]">({artist.reviewCount})</span>
                      </div>
                    </div>

                    {/* Right: Hourly Rate & BNPL CTA */}
                    <div className="flex items-center justify-between md:justify-end gap-4 pl-10 md:pl-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#ebdcc8]">
                      <div className="text-left md:text-right">
                        <div className="text-sm font-serif font-bold text-[#2c2722]">
                          ${artist.baseHourlyRate}<span className="text-xs font-sans font-normal text-[#756a5c]">/hr</span>
                        </div>
                        <div className="text-[10px] font-sans text-[#4d7350] flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span>BNPL: ${Math.round(artist.baseHourlyRate * 0.2)} down</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArtist(artist);
                        }}
                        className="px-4 py-2 text-xs font-medium text-[#faf8f5] bg-[#3a352f] group-hover:bg-[#1f1c19] rounded-md transition-colors shadow-xs active:scale-95 whitespace-nowrap"
                      >
                        Book Artist
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: ARTISANAL CARDS GRID ================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist)}
              className="paper-card rounded-xl overflow-hidden border border-[#c5a880]/35 bg-[#faf8f5] shadow-sm flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative h-52 overflow-hidden bg-[#e8e2d4]">
                <img
                  src={artist.sketchImage}
                  alt={artist.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover watercolor-filter group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Badges on image */}
                <div className="absolute top-3 left-3 bg-[#faf8f5]/90 backdrop-blur-xs text-[#2c2722] text-[11px] font-sans px-2.5 py-1 rounded border border-[#d6c9b5] shadow-xs">
                  {artist.category}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d9c5a3]" />
                    <span>{artist.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono bg-black/40 px-2 py-0.5 rounded">
                    ★ {artist.rating.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-serif font-semibold text-[#2c2722] group-hover:text-[#6a5438] transition-colors">
                    {artist.name}
                  </h4>
                  <p className="text-xs text-[#6e6355] mt-1 line-clamp-2 font-sans">
                    {artist.bio}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {artist.instruments.map((ins, i) => (
                      <span key={i} className="text-[10px] bg-[#f0ebd9] text-[#554b3f] px-2 py-0.5 rounded border border-[#dfd4c0]">
                        {ins}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer price & book */}
                <div className="mt-5 pt-3 border-t border-[#ebdcc8] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-serif font-bold text-[#2c2722]">
                      ${artist.baseHourlyRate}<span className="text-xs font-sans font-normal text-[#756a5c]">/hr</span>
                    </div>
                    <div className="text-[10px] text-[#4d7350] font-sans">
                      GigCredit BNPL Ready
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArtist(artist);
                    }}
                    className="px-3.5 py-1.5 text-xs font-medium text-[#faf8f5] bg-[#3a352f] group-hover:bg-[#1f1c19] rounded-md transition-colors"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};
