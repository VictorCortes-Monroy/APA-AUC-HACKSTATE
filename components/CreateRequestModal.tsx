import React, { useState } from 'react';
import { X, MapPin, Sparkles, Loader2, AlertTriangle, GraduationCap } from 'lucide-react';
import { analyzeRequestAndGetTags } from '../services/geminiService';
import { checkContentSafety } from '../services/moderation';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string; location: string; offer: string; tags: string[]; topic: string; preferredMajor: string }) => void;
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

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [preferredMajor, setPreferredMajor] = useState(MAJORS[0]);
  const [offer, setOffer] = useState('15 min Karma');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = async () => {
    setError(null);
    if (!description.trim()) return;
    
    // 1. Safety Check (Client-side simulation for MVP Demo)
    const safety = checkContentSafety(description);
    if (!safety.safe) {
        setError(safety.reason || "Contenido no permitido.");
        // Stop execution here to show the "Error" effect
        return;
    }
    
    setIsAnalyzing(true);
    // Simulate AI thinking delay for UX if API is instant
    const tags = await analyzeRequestAndGetTags(description);
    
    // Guess a topic from the first tag or general
    const topic = tags.length > 0 ? tags[0] : "Ayuda General";
    
    setIsAnalyzing(false);
    onSubmit({ description, location, offer, tags, topic, preferredMajor });
    setStep(1); // Reset
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
                  if (error) setError(null); // Clear error on edit
              }}
              placeholder="Ej: Necesito una presentación visual impactante para mi tesis..."
              className={`w-full p-4 bg-slate-50 border rounded-xl focus:ring-2 outline-none resize-none text-slate-700 h-24 transition-all ${
                  error 
                  ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              autoFocus
            />
            
            {/* Error Message Area */}
            {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <div className="bg-white p-1 rounded-full shadow-sm mt-0.5">
                         <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-0.5">Moderación Automática</p>
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
                <p className="text-[10px] text-slate-400 mt-1 pl-1">
                   💡 Tip: Pedir ayuda a otra disciplina da <span className="font-bold text-amber-500">Bonus x1.5</span> al ayudante.
                </p>
            </div>
          </div>

          {/* Offer Selector */}
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" /> Oferta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setOffer('15 min Karma')}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  offer === '15 min Karma' 
                    ? 'bg-amber-50 border-amber-300 text-amber-800 ring-1 ring-amber-300' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                15 Karma Pts
              </button>
              <button 
                type="button"
                onClick={() => setOffer('Un Café')}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  offer === 'Un Café' 
                    ? 'bg-amber-50 border-amber-300 text-amber-800 ring-1 ring-amber-300' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Un Café ☕️
              </button>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!description.trim() || isAnalyzing}
            className={`w-full font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                error 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analizando...
              </>
            ) : (
              "Lanzar Bengala 🚀"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;