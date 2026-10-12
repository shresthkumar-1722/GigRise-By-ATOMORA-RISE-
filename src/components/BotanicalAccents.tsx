import React from 'react';

/**
 * Botanical watercolor accents framing the viewport edges,
 * inspired by Meng To's watercolor botanical sketchbook aesthetic.
 */
export const BotanicalAccents: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none opacity-40">
      {/* Top Left Botanical Fern & Leaf Wash */}
      <svg
        className="absolute -top-12 -left-12 w-80 h-80 text-[#8a9a86] mix-blend-multiply transition-opacity duration-1000"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.65" filter="blur(0.5px)">
          {/* Stem 1 */}
          <path
            d="M 30,30 Q 120,90 190,190"
            stroke="#6e7d69"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <path d="M 50,45 Q 80,30 95,50 Q 80,65 50,45 Z" fill="#8d9d88" opacity="0.7" />
          <path d="M 80,68 Q 115,55 130,80 Q 110,95 80,68 Z" fill="#7d8e78" opacity="0.8" />
          <path d="M 115,100 Q 150,90 160,118 Q 140,130 115,100 Z" fill="#99a894" opacity="0.6" />
          <path d="M 150,140 Q 185,130 200,160 Q 175,170 150,140 Z" fill="#83947e" opacity="0.75" />
          
          {/* Secondary branching fern */}
          <path
            d="M 80,68 Q 50,130 65,190"
            stroke="#7a8a75"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M 70,100 Q 40,95 35,115 Q 55,120 70,100 Z" fill="#91a28c" opacity="0.65" />
          <path d="M 65,135 Q 35,140 40,160 Q 60,155 65,135 Z" fill="#869781" opacity="0.7" />

          {/* Soft tea-stained watercolor wash pool */}
          <ellipse cx="60" cy="60" rx="90" ry="70" fill="#c9bba6" opacity="0.18" />
          <ellipse cx="120" cy="110" rx="80" ry="60" fill="#a8b5a2" opacity="0.15" />
        </g>
      </svg>

      {/* Top Right Delicate Eucalyptus Wash */}
      <svg
        className="absolute -top-16 -right-16 w-88 h-88 text-[#9da998] mix-blend-multiply opacity-55"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="blur(0.5px)">
          <path
            d="M 270,30 Q 190,110 130,220"
            stroke="#798974"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="240" cy="65" r="18" fill="#8ea08a" opacity="0.6" />
          <circle cx="205" cy="105" r="22" fill="#7f917a" opacity="0.65" />
          <circle cx="170" cy="150" r="20" fill="#99a994" opacity="0.55" />
          <circle cx="140" cy="195" r="16" fill="#879982" opacity="0.7" />

          {/* Golden pollen / ochre wash */}
          <ellipse cx="220" cy="90" rx="75" ry="65" fill="#d9c5a3" opacity="0.14" />
        </g>
      </svg>

      {/* Bottom Right Soft Botanical Flourish */}
      <svg
        className="absolute -bottom-16 -right-16 w-80 h-80 text-[#8a9a86] mix-blend-multiply opacity-45"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="blur(0.5px)">
          <path
            d="M 270,270 Q 180,210 110,130"
            stroke="#6e7d69"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M 240,240 Q 200,245 190,225 Q 220,215 240,240 Z" fill="#889a84" opacity="0.7" />
          <path d="M 200,205 Q 165,215 155,190 Q 185,185 200,205 Z" fill="#788a73" opacity="0.75" />
          <path d="M 160,165 Q 130,175 125,150 Q 150,145 160,165 Z" fill="#92a38d" opacity="0.65" />
          <ellipse cx="230" cy="230" rx="80" ry="70" fill="#cfbeab" opacity="0.15" />
        </g>
      </svg>
    </div>
  );
};
