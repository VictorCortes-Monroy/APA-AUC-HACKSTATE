import React from 'react';
import { HelpRequest } from '../types';
import { MapPin, Flame } from 'lucide-react';

interface CampusMapProps {
  requests: HelpRequest[];
  onZoneClick: (location: string) => void;
}

// Coordinates for the static map (Percentages for responsiveness)
const LOCATION_COORDS: Record<string, { top: string; left: string }> = {
  "Biblioteca - Piso 1": { top: '45%', left: '50%' },
  "Biblioteca - Piso 2": { top: '42%', left: '52%' }, // Slightly offset
  "Biblioteca - Piso 3": { top: '40%', left: '48%' },
  "Cafetería Central": { top: '65%', left: '30%' },
  "Patio de Ingeniería": { top: '25%', left: '70%' },
  "Edificio A - Hall": { top: '75%', left: '75%' },
  "Laboratorios de Cómputo": { top: '20%', left: '25%' }
};

const CampusMap: React.FC<CampusMapProps> = ({ requests, onZoneClick }) => {
  // Group requests by location
  const locationCounts = requests.reduce((acc, req) => {
    acc[req.location] = (acc[req.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="relative w-full h-[400px] bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-4">
      {/* Background "Map" Image - Using a geometric pattern to simulate a campus map plan */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Abstract Buildings */}
            <rect x="25%" y="20%" width="15%" height="20%" fill="#94a3b8" />
            <rect x="65%" y="20%" width="15%" height="15%" fill="#94a3b8" />
            <rect x="45%" y="40%" width="10%" height="10%" fill="#64748b" /> {/* Library */}
            <rect x="25%" y="60%" width="20%" height="15%" fill="#94a3b8" />
            <rect x="70%" y="70%" width="15%" height="15%" fill="#94a3b8" />
            
            {/* Paths */}
            <path d="M 175 160 Q 200 200 225 160 T 300 300" stroke="#cbd5e1" strokeWidth="8" fill="none" />
         </svg>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs font-medium text-slate-500 z-10">
        🗺️ Waze del Conocimiento
      </div>

      {/* Pins */}
      {Object.entries(locationCounts).map(([location, count]) => {
        const coords = LOCATION_COORDS[location] || { top: '50%', left: '50%' };
        const numCount = count as number;
        const isHot = numCount >= 4;
        
        return (
          <button
            key={location}
            onClick={() => onZoneClick(location)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 group"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="relative flex flex-col items-center">
               {/* Hot Zone Indicator */}
               {isHot && (
                 <div className="absolute -top-8 animate-bounce">
                    <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-lg border border-red-400">
                        <Flame className="w-3 h-3 mr-1 fill-yellow-300 text-yellow-300" />
                        HOT
                    </div>
                 </div>
               )}

               {/* Pin Body */}
               <div className={`
                 relative w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 border-white
                 ${isHot ? 'bg-gradient-to-br from-red-500 to-orange-500 animate-pulse' : 'bg-gradient-to-br from-yellow-400 to-amber-400'}
               `}>
                 <span className={`font-bold ${isHot ? 'text-white' : 'text-slate-900'}`}>{numCount}</span>
                 
                 {/* Ripple Effect for Hot Zones */}
                 {isHot && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                 )}
               </div>
               
               {/* Pin Arrow */}
               <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${isHot ? 'border-t-red-500' : 'border-t-yellow-400'} mt-[-2px]`}></div>
               
               {/* Label Tooltip */}
               <div className="opacity-0 group-hover:opacity-100 absolute top-full mt-1 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap transition-opacity z-20 pointer-events-none">
                 {location}
               </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CampusMap;