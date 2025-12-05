import React from 'react';
import { MapPin, Clock, Zap, ArrowRight, Target } from 'lucide-react';
import { HelpRequest } from '../types';

interface RequestCardProps {
  request: HelpRequest;
  onAccept: (request: HelpRequest) => void;
  isOwnRequest?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, isOwnRequest = false }) => {
  const timeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Ahora mismo';
    return `Hace ${minutes} min`;
  };

  const showPreference = request.preferredMajor && !request.preferredMajor.includes('Cualquiera');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4 relative overflow-hidden group">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>

      <div className="flex justify-between items-start mb-3 pl-2">
        <div className="flex items-center gap-2">
          <img 
            src={request.requesterAvatar} 
            alt={request.requesterName} 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
          />
          <div>
            <h3 className="font-semibold text-slate-900 leading-tight">{request.requesterName}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeAgo(request.timestamp)}
              <span className="mx-1">•</span>
              <span className="text-slate-400">{request.requesterMajor}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-bold border border-amber-100">
          <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
          {request.offer}
        </div>
      </div>

      <div className="pl-2 mb-4">
        {/* Preference Badge */}
        {showPreference && (
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2 border border-indigo-100">
                <Target className="w-3 h-3" />
                Busca: {request.preferredMajor}
            </div>
        )}

        <h4 className="text-lg font-bold text-slate-800 mb-1">{request.topic}</h4>
        <p className="text-sm text-slate-600 line-clamp-2">{request.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
            {request.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                    {tag}
                </span>
            ))}
        </div>
      </div>

      <div className="pl-2 flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
        <div className="flex items-center text-xs text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
          {request.location}
        </div>
        
        {!isOwnRequest && (
          <button 
            onClick={() => onAccept(request)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-slate-200"
          >
            Ayudar <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {isOwnRequest && (
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                Tu solicitud activa
            </span>
        )}
      </div>
    </div>
  );
};

export default RequestCard;