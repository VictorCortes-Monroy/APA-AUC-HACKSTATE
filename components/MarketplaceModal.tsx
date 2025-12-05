import React from 'react';
import { X, Coffee, Printer, Zap } from 'lucide-react';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  karma: number;
}

const MarketplaceModal: React.FC<MarketplaceModalProps> = ({ isOpen, onClose, karma }) => {
  if (!isOpen) return null;

  const items = [
    { id: 1, name: 'Café Americano', cost: 150, icon: <Coffee className="w-6 h-6 text-amber-700" />, desc: 'Cafetería Central' },
    { id: 2, name: '10 Impresiones', cost: 100, icon: <Printer className="w-6 h-6 text-indigo-600" />, desc: 'Centro de Copiado' },
    { id: 3, name: 'Red Bull', cost: 250, icon: <Zap className="w-6 h-6 text-blue-500" />, desc: 'Máquinas Expendedoras' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-1">Cafetería Coin</h2>
            <p className="opacity-90 text-sm">Tu conocimiento financia tu bienestar.</p>
            <div className="mt-4 inline-flex items-center bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
                <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200 mr-2" />
                <span className="font-bold">{karma} Puntos Disponibles</span>
            </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-3">
            {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-amber-200 transition-colors bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                    </div>
                    <button 
                        disabled={karma < item.cost}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            karma >= item.cost 
                            ? 'bg-slate-900 text-white shadow-md active:scale-95' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {item.cost} Pts
                    </button>
                </div>
            ))}
        </div>
        
        <div className="p-4 bg-slate-50 text-center text-xs text-slate-400 border-t border-slate-100">
            Escanea el QR en caja para canjear
        </div>
      </div>
    </div>
  );
};

export default MarketplaceModal;