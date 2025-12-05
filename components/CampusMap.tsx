import React, { useMemo, useEffect, useState } from 'react';
import { HelpRequest } from '../types';
import { CAMPUS_GEOMETRY, MapFeature } from '../data/campusMapData';
import { fetchMapData, ExternalBuilding } from '../services/mapService';
import { Loader2, RefreshCw } from 'lucide-react';

interface CampusMapProps {
  requests: HelpRequest[];
  onZoneClick: (location: string) => void;
}

interface EnrichedMapFeature extends MapFeature {
  externalData?: ExternalBuilding;
  requestCount: number;
  isHot: boolean;
  intensity: 'low' | 'medium' | 'high';
}

const CampusMap: React.FC<CampusMapProps> = ({ requests, onZoneClick }) => {
  const [externalBuildings, setExternalBuildings] = useState<ExternalBuilding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // 1. Cargar Datos Externos (Simulación de Fork/Fetch del Repo)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchMapData();
      setExternalBuildings(data);
      setIsLoading(false);
      setLastUpdated(Date.now());
    };
    loadData();
  }, []);

  // 2. FUSIÓN DE DATOS: (Geometría Local + Datos Repo Externo + Solicitudes Vivas)
  const featuresWithStats = useMemo(() => {
    return CAMPUS_GEOMETRY.map((feature) => {
      // A. Match con Datos Externos (Repo)
      // Buscamos si algún edificio del repo coincide con el nombre de nuestra geometría
      // Normalizamos strings para evitar errores por tildes o mayúsculas
      const matchedBuilding = externalBuildings.find(b => 
        feature.name.toLowerCase().includes(b.name.toLowerCase()) || 
        b.name.toLowerCase().includes(feature.name.toLowerCase())
      );

      // B. Match con Solicitudes (Firebase/Estado)
      // Contamos cuántas solicitudes ocurren en este lugar
      // Usamos una lógica laxa: si la ubicación de la solicitud contiene el nombre del edificio
      const hitCount = requests.filter(req => {
        const reqLoc = req.location.toLowerCase();
        const featName = feature.name.toLowerCase();
        const extName = matchedBuilding?.name.toLowerCase();

        return reqLoc.includes(featName) || (extName && reqLoc.includes(extName));
      }).length;

      // C. Determinar "Temperatura" (Hot Zone)
      const isHot = hitCount >= 2; // Umbral bajo para demo
      let intensity: 'low' | 'medium' | 'high' = 'low';
      if (hitCount >= 5) intensity = 'high';
      else if (hitCount >= 2) intensity = 'medium';

      return {
        ...feature,
        externalData: matchedBuilding,
        requestCount: hitCount,
        isHot,
        intensity
      } as EnrichedMapFeature;
    });
  }, [requests, externalBuildings]);

  // Manejar click
  const handleFeatureClick = (feature: EnrichedMapFeature) => {
    // Si tenemos nombre oficial del repo externo, lo usamos, si no el local
    const locationName = feature.externalData?.name || feature.name;
    onZoneClick(locationName);
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-4 group">
       {/* UI Overlay: Status Bar */}
       <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-10">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 pointer-events-auto flex items-center gap-2">
            {isLoading ? (
               <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
            ) : (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            )}
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 leading-none">San Joaquín</span>
                <span className="text-[9px] text-slate-400 font-medium">
                    {isLoading ? 'Sincronizando repo...' : `Actualizado: ${new Date(lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                </span>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-sm border border-slate-200 pointer-events-auto flex flex-col gap-1">
             <div className="flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                 <span className="text-[9px] font-bold text-slate-600">Alta Demanda</span>
             </div>
             <div className="flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                 <span className="text-[9px] font-bold text-slate-600">Actividad</span>
             </div>
          </div>
       </div>

      {/* Interactive SVG Map */}
      <svg 
        viewBox="0 0 800 600" 
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
            <pattern id="grass" width="20" height="20" patternUnits="userSpaceOnUse">
                 <rect width="20" height="20" fill="#f1f5f9" />
                 <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.5" />
            </pattern>
        </defs>
        
        {/* Background */}
        <rect width="800" height="600" fill="url(#grass)" />

        {/* Render Features */}
        {featuresWithStats.map((feature) => {
            const { requestCount, isHot, intensity } = feature;
            
            // Estilos dinámicos basados en la "Fusion de Datos"
            let fill = "#cbd5e1"; 
            let stroke = "#94a3b8";
            let strokeWidth = 1;
            
            if (feature.type === 'green_area') {
                fill = "#dcfce7";
                stroke = "none";
            } else if (feature.type === 'building') {
                if (intensity === 'high') {
                    fill = "#fee2e2"; // Rojo intenso
                    stroke = "#ef4444";
                    strokeWidth = 3;
                } else if (intensity === 'medium') {
                    fill = "#ffedd5"; // Naranja
                    stroke = "#f97316";
                    strokeWidth = 2;
                } else if (requestCount > 0) {
                    fill = "#e0e7ff"; // Indigo activo
                    stroke = "#6366f1";
                    strokeWidth = 2;
                } else {
                    fill = "#e2e8f0"; // Inactivo
                    stroke = "#94a3b8";
                }
            }

            return (
                <g 
                    key={feature.id} 
                    onClick={() => handleFeatureClick(feature)}
                    className="cursor-pointer transition-all duration-300 hover:brightness-95"
                    style={{ transformOrigin: 'center' }}
                >
                    <path 
                        d={feature.path} 
                        fill={fill} 
                        stroke={stroke} 
                        strokeWidth={strokeWidth}
                        className="transition-all duration-500"
                    />
                    
                    {/* Hover Label */}
                    <text 
                        x={feature.labelPos.x} 
                        y={feature.labelPos.y + 40} 
                        textAnchor="middle" 
                        className="text-[10px] fill-slate-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white"
                        style={{ textShadow: '0px 0px 4px white' }}
                    >
                        {feature.externalData?.name || feature.name}
                    </text>
                </g>
            );
        })}

        {/* Render Pins (Overlay Data) */}
        {featuresWithStats.map((feature) => {
             if (feature.requestCount === 0) return null;

             const isHigh = feature.intensity === 'high';

             return (
                 <g key={`pin-${feature.id}`} transform={`translate(${feature.labelPos.x}, ${feature.labelPos.y})`} style={{ pointerEvents: 'none' }}>
                    
                    {/* Radar Pulse Animation for Hot Zones */}
                    {isHigh && (
                        <>
                         <circle r="30" fill="#ef4444" opacity="0.2">
                             <animate attributeName="r" from="20" to="50" dur="2s" repeatCount="indefinite" />
                             <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                         </circle>
                         <circle r="20" fill="#ef4444" opacity="0.2">
                             <animate attributeName="r" from="15" to="30" dur="2s" begin="0.5s" repeatCount="indefinite" />
                             <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
                         </circle>
                        </>
                    )}
                    
                    {/* Pin Body */}
                    <circle 
                        r={isHigh ? 16 : 12} 
                        fill={isHigh ? "#ef4444" : "#6366f1"} 
                        stroke="white" 
                        strokeWidth="2"
                        className="drop-shadow-lg transition-all duration-500"
                    />
                    
                    {/* Counter Text */}
                    <text 
                        y="4" 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize={isHigh ? "12" : "10"} 
                        fontWeight="bold"
                    >
                        {feature.requestCount}
                    </text>

                    {/* Fire Icon for High Intensity */}
                    {isHigh && (
                        <g transform="translate(10, -15) scale(0.8)">
                            <circle cx="8" cy="8" r="10" fill="white" stroke="#ef4444" strokeWidth="1"/>
                            <text x="8" y="12" textAnchor="middle" fontSize="10">🔥</text>
                        </g>
                    )}
                 </g>
             );
        })}
      </svg>
    </div>
  );
};

export default CampusMap;