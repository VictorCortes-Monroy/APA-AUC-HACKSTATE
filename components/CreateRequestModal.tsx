import React, { useState } from 'react';
import { X, MapPin, Sparkles, Loader2, AlertTriangle, GraduationCap, Zap, Wallet } from 'lucide-react';
import { analyzeRequestAndGetTags } from '../services/geminiService';
import { checkContentSafety } from '../services/moderation';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string; location: string; offer: string; karmaValue: number; tags: string[]; topic: string; preferredMajor: string }) => void;
  userKarma: number;
}

const LOCATIONS = [
  "Biblioteca - Piso 1",
  "Biblioteca - Piso 2",
  "Biblioteca - Piso 3",
  "Cafetería Central",
  "Patio de Ingeniería",
  "Edificio A - Hall",
  "Laboratorios de Cómputo"
];

const MAJORS = [
  "Cualquiera (Más rápido)",
  "Ingeniería / Ciencias",
  "Artes / Diseño",
  "Derecho / Letras",
  "Salud / Medicina",
  "Arquitectura",
  "Negocios / Economía"
];

const OFFERS = [
    { label: 'Básico', value: 20, desc: 'Ayuda rápida' },
    { label: 'Estándar', value: 50, desc: 'Prioridad normal' },
    { label: 'Urgente', value: 100, desc: '¡Lo necesito ya!' },
];

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onSubmit, userKarma }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [preferredMajor, setPreferredMajor] = useState(MAJORS[0]);
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = async () => {
    setError(null);
    if (!description.trim()) return;
    
    // Safety & Balance Check
    const safety = checkContentSafety(description);
    if (!safety.safe) {
        setError(safety.reason || "Contenido no permitido.");
        return;
    }

    if (userKarma < selectedOffer.value) {
        setError(`Saldo insuficiente. Necesitas ${selectedOffer.value} Karma.`);
        return;
    }
    
    setIsAnalyzing(true);
    // Simulate AI thinking delay
    const tags = await analyzeRequestAndGetTags(description);
    
    const topic = tags.length > 0 ? tags[0] : "Ayuda General";
    
    setIsAnalyzing(false);
    onSubmit({ 
        description, 
        location, 
        offer: `${selectedOffer.value} Pts`, 
        karmaValue: selectedOffer.value,
        tags, 
        topic, 
        preferredMajor 
    });
    setDescription('');
    setError(null);
    onClose();
  };

  const handleClose = () => {
      setError(null);
      setDescription('');
      onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl pointer-events-auto transform transition-transform duration-300 animate-in slide-in-from-bottom-full p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Pedir Ayuda</h2>
          <button onClick={handleClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Input Area */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              ¿Qué necesitas?
            </label>
            <textarea 
              value={description}
              onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError(null);
              }}
              placeholder="Ej: Necesito una presentación visual impactante para mi tesis..."
              className={`w-full p-4 bg-slate-50 border rounded-xl focus:ring-2 outline-none resize-none text-slate-700 h-24 transition-all ${
                  error 
                  ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              autoFocus
            />
            
            {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <div className="bg-white p-1 rounded-full shadow-sm mt-0.5">
                         <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-0.5">Atención</p>
                        <p className="text-sm text-red-700 leading-snug">{error}</p>
                    </div>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
             {/* Location Selector */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> ¿Dónde estás?
                </label>
                <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 appearance-none"
                >
                {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                ))}
                </select>
            </div>

            {/* Preferred Major Selector */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <GraduationCap className="w-4 h-4" /> Preferencia de Ayudante
                </label>
                <select 
                value={preferredMajor}
                onChange={(e) => setPreferredMajor(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 appearance-none"
                >
                {MAJORS.map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
                </select>
            </div>
          </div>

          {/* Offer Selector (Budget) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <div className="flex justify-between items-center mb-3">
                 <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Recompensa (Abono)
                </label>
                <div className={`text-xs font-bold px-2 py-1 rounded border ${userKarma < selectedOffer.value ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-slate-600 border-slate-200'}`}>
                    <Wallet className="w-3 h-3 inline mr-1" />
                    Saldo: {userKarma}
                </div>
             </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {OFFERS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedOffer(opt)}
                    className={`p-2 rounded-lg text-center transition-all border-2 ${
                        selectedOffer.value === opt.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-transparent bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                      <div className="font-black text-lg">{opt.value}</div>
                      <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">{opt.label}</div>
                  </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200">
                 <span>Se descontará de tu saldo al publicar.</span>
                 <span className="font-medium text-slate-900">{selectedOffer.desc}</span>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!description.trim() || isAnalyzing || userKarma < selectedOffer.value}
            className={`w-full font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                (!description.trim() || userKarma < selectedOffer.value)
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Procesando Abono...
              </>
            ) : (
              `Publicar y Abonar ${selectedOffer.value} Pts`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;