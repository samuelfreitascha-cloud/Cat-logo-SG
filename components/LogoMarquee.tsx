import React from 'react';

const LOGOS = [
  { name: 'SunGap', url: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1764531396/Prancheta_2_woxeff.svg' },
  { name: 'Banner', url: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1764531395/Prancheta_4_tduqp4.svg' },
  { name: 'Sacolas do Bem', url: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1764531394/Prancheta_7_ah3erk.svg' },
  { name: 'PDV', url: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1764531394/Prancheta_5_zfhs68.svg' },
  { name: 'OIA', url: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1764531394/Prancheta_3_zxx4d8.svg' },
  { name: 'StampAsi', url: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1764531394/Prancheta_6_xusaw9.svg' },
];

export const LogoMarquee: React.FC = () => {
  const extendedLogos = [...LOGOS, ...LOGOS]; // Duplicate logos for a seamless loop

  return (
    <div className="relative w-full overflow-hidden mb-6 group">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {extendedLogos.map((logo, index) => (
          <div key={index} className="flex-shrink-0 mx-4">
            <img 
              src={logo.url} 
              alt={logo.name} 
              className="h-9 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background-light via-transparent to-background-light pointer-events-none"></div>
    </div>
  );
};