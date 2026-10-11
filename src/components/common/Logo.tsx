import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  lightMode = false,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 50, text: 'text-2xl', badge: 'text-xs' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Original Emblem: Shield + Heart + Stylized Paw */}
      <div
        className="relative flex items-center justify-center rounded-2xl p-1.5 shadow-sm transition-transform hover:scale-105"
        style={{
          background: lightMode
            ? 'linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)'
            : 'linear-gradient(135deg, #154734 0%, #0F3426 100%)',
          border: lightMode ? '1px solid rgba(255,255,255,0.4)' : '1px solid #205c44',
        }}
      >
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all"
        >
          {/* Protective Shield Outline */}
          <path
            d="M50 8C68 15 84 14 88 28C92 50 82 78 50 94C18 78 8 50 12 28C16 14 32 15 50 8Z"
            stroke={lightMode ? '#154734' : '#84A98C'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={lightMode ? '#84A98C' : '#154734'}
            fillOpacity={lightMode ? '0.15' : '0.4'}
          />

          {/* Integrated Soft Heart Shape */}
          <path
            d="M50 36 C42 22, 24 24, 24 40 C24 54, 38 66, 50 78 C62 66, 76 54, 76 40 C76 24, 58 22, 50 36 Z"
            fill={lightMode ? '#154734' : '#FAF7F0'}
            fillOpacity="0.95"
          />

          {/* Stylized Paw Central Pad */}
          <path
            d="M50 63 C44 63, 38 58, 38 52 C38 46, 44 43, 50 43 C56 43, 62 46, 62 52 C62 58, 56 63, 50 63 Z"
            fill={lightMode ? '#FAF7F0' : '#154734'}
          />

          {/* Paw Toe 1 (Left Outer) */}
          <ellipse
            cx="34"
            cy="40"
            rx="4.5"
            ry="6"
            transform="rotate(-20 34 40)"
            fill={lightMode ? '#FAF7F0' : '#154734'}
          />

          {/* Paw Toe 2 (Left Inner) */}
          <ellipse
            cx="44"
            cy="33"
            rx="4.8"
            ry="6.5"
            transform="rotate(-8 44 33)"
            fill={lightMode ? '#FAF7F0' : '#154734'}
          />

          {/* Paw Toe 3 (Right Inner) */}
          <ellipse
            cx="56"
            cy="33"
            rx="4.8"
            ry="6.5"
            transform="rotate(8 56 33)"
            fill={lightMode ? '#FAF7F0' : '#154734'}
          />

          {/* Paw Toe 4 (Right Outer) */}
          <ellipse
            cx="66"
            cy="40"
            rx="4.5"
            ry="6"
            transform="rotate(20 66 40)"
            fill={lightMode ? '#FAF7F0' : '#154734'}
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight ${dim.text} ${
                lightMode ? 'text-white' : 'text-[#154734]'
              }`}
            >
              PetCare
            </span>
            <span className="font-light text-[#84a98c]">360</span>
          </div>
          <span
            className={`font-medium tracking-wider uppercase ${dim.badge} ${
              lightMode ? 'text-emerald-200' : 'text-slate-500'
            }`}
          >
            Cuidados & Educação Animal
          </span>
        </div>
      )}
    </div>
  );
};
