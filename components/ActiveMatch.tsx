import React, { useState, useEffect } from 'react';
import { HelpRequest, ChatMessage, User } from '../types';
import { Send, CheckCircle, MapPin, Phone, Award, BrainCircuit, Loader2, ArrowRight } from 'lucide-react';
import { generateIcebreaker, generateKnowledgeSnippet } from '../services/geminiService';
import { calculateRewards } from '../services/gamification';

interface ActiveMatchProps {
  request: HelpRequest;
  currentUser: User;
  onComplete: (extraBonus?: number) => void;
}

interface KnowledgeSnippet {
    question_summary: string;
    solution_summary: string;
}

const ActiveMatch: React.FC<ActiveMatchProps> = ({ request, currentUser, onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  
  // UI States for completion flow
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [isGeneratingKnowledge, setIsGeneratingKnowledge] = useState(false);
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeSnippet | null>(null);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [rewardData, setRewardData] = useState<{points: number, isBonus: boolean, message: string, breakdown: { base: number, bonus: number }} | null>(null);

  const isRequester = request.requesterId === currentUser.id;
  const otherPersonName = isRequester ? 'Ayudante' : request.requesterName;
  const otherPersonAvatar = isRequester ? 'https://picsum.photos/200/200' : request.requesterAvatar;

  useEffect(() => {
    // Simulate initial system message or icebreaker
    const initChat = async () => {
      const icebreaker = await generateIcebreaker(request.topic);
      setMessages([
        {
          id: 'sys-1',
          senderId: 'system',
          text: `¡Match exitoso! Reúnanse en: ${request.location}. Incentivo: ${request.karmaValue} Pts.`,
          timestamp: Date.now() - 10000
        },
        {
            id: 'msg-1',
            senderId: isRequester ? request.helperId! : request.requesterId, // Message from the OTHER person
            text: icebreaker,
            timestamp: Date.now()
        }
      ]);
    };
    initChat();
  }, [request]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: Date.now()
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleInitialCompleteClick = () => {
      // Instead of finishing immediately, open the Knowledge Brain proposal
      setShowKnowledgeModal(true);
  };

  const handleGenerateKnowledge = async () => {
      setIsGeneratingKnowledge(true);
      // Format chat history for the AI
      const historyForAI = messages.map(m => ({
          role: m.senderId === currentUser.id ? "Ayudante" : "Estudiante",
          text: m.text
      }));
      
      const snippet = await generateKnowledgeSnippet(historyForAI, request.topic);
      setKnowledgeData(snippet);
      setIsGeneratingKnowledge(false);
  };

  const handleFinalize = (withAiBonus: boolean) => {
    setShowKnowledgeModal(false);
    
    // Calculate rewards using the financial base value from the request
    const rewards = calculateRewards(request.requesterMajor, currentUser.major, request.karmaValue);
    setRewardData(rewards);

    setIsCompleting(true);
    setTimeout(() => {
      onComplete(withAiBonus ? 20 : 0); // Pass extra bonus if applicable
    }, 3500); 
  };

  if (isCompleting && rewardData) {
    const aiBonus = knowledgeData ? 20 : 0;
    const totalPoints = rewardData.points + aiBonus;

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-500 bg-white z-50">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce ${rewardData.isBonus ? 'bg-amber-100' : 'bg-green-100'}`}>
          {rewardData.isBonus ? (
             <Award className="w-12 h-12 text-amber-600" />
          ) : (
             <CheckCircle className="w-12 h-12 text-green-600" />
          )}
        </div>
        
        <h2 className="text-4xl font-black text-slate-800 mb-2">
            +{totalPoints} Karma
        </h2>
        
        {/* Breakdown */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 w-full max-w-xs space-y-2">
             {/* Financial Base */}
            <div className="flex justify-between text-sm text-slate-600">
                <span>Abono Base</span>
                <span className="font-bold">+{rewardData.breakdown.base}</span>
            </div>
             {/* System Bonuses */}
             {rewardData.breakdown.bonus > 0 && (
                <div className="flex justify-between text-sm text-amber-600">
                    <span>Bono Interdisciplinario</span>
                    <span className="font-bold">+{rewardData.breakdown.bonus}</span>
                </div>
             )}
            
            {/* AI Bonus */}
            {aiBonus > 0 && (
                <div className="flex justify-between text-sm text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100 mt-1">
                    <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3"/> Cerebro Colectivo</span>
                    <span className="font-bold">+{aiBonus}</span>
                </div>
            )}
            <div className="border-t border-slate-200 pt-2 text-xs text-slate-400 mt-2">
                {rewardData.message}
            </div>
        </div>

        <div className="w-full max-w-xs bg-slate-100 rounded-xl p-4 opacity-50">
          <p className="text-sm text-slate-500 mb-2">Califica la experiencia</p>
          <div className="flex justify-center gap-2 text-2xl grayscale">
            {'⭐⭐⭐⭐⭐'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Knowledge Modal Overlay */}
      {showKnowledgeModal && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-full max-w-sm">
                  {!knowledgeData ? (
                      // Step 1: Offer
                      <div className="text-center">
                          <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                              <BrainCircuit className={`w-10 h-10 text-indigo-600 ${isGeneratingKnowledge ? 'animate-pulse' : ''}`} />
                          </div>
                          <h2 className="text-2xl font-bold text-slate-900 mb-2">Cerebro Colectivo</h2>
                          <p className="text-slate-600 mb-6 leading-relaxed">
                              ¿Quieres ganar <span className="font-bold text-amber-500">+20 Karma Extra</span>? 
                              <br/>
                              Deja que la IA extraiga el conocimiento de este chat para ayudar a futuros estudiantes.
                          </p>
                          
                          <button 
                            onClick={handleGenerateKnowledge}
                            disabled={isGeneratingKnowledge}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 mb-3 flex items-center justify-center gap-2"
                          >
                              {isGeneratingKnowledge ? (
                                  <><Loader2 className="w-5 h-5 animate-spin"/> Analizando conversación...</>
                              ) : (
                                  <><BrainCircuit className="w-5 h-5"/> Generar Solución (+20 Karma)</>
                              )}
                          </button>
                          
                          <button 
                            onClick={() => handleFinalize(false)}
                            disabled={isGeneratingKnowledge}
                            className="text-slate-400 font-medium text-sm hover:text-slate-600"
                          >
                              No gracias, solo finalizar
                          </button>
                      </div>
                  ) : (
                      // Step 2: Preview Result
                      <div>
                          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-3 opacity-10">
                                  <BrainCircuit className="w-24 h-24 text-green-600" />
                              </div>
                              <h3 className="text-green-800 font-bold text-lg mb-4 flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5"/> Conocimiento Generado
                              </h3>
                              
                              <div className="space-y-4 relative z-10">
                                  <div>
                                      <div className="text-[10px] uppercase tracking-wider font-bold text-green-700 mb-1">Pregunta</div>
                                      <div className="bg-white/60 p-2 rounded-lg text-sm text-green-900 italic">
                                          "{knowledgeData.question_summary}"
                                      </div>
                                  </div>
                                  <div>
                                      <div className="text-[10px] uppercase tracking-wider font-bold text-green-700 mb-1">Solución</div>
                                      <div className="bg-white/60 p-2 rounded-lg text-sm text-green-900">
                                          {knowledgeData.solution_summary}
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <button 
                             onClick={() => handleFinalize(true)}
                             className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                           >
                               Confirmar y Recibir Bonus <ArrowRight className="w-5 h-5" />
                           </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex-none p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
             <img src={otherPersonAvatar} alt={otherPersonName} className="w-10 h-10 rounded-full object-cover" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{otherPersonName}</h3>
            <div className="flex items-center gap-2">
                 <p className="text-xs text-slate-500">{request.topic}</p>
                 <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-200">
                    Garantía: {request.karmaValue} Pts
                 </span>
            </div>
          </div>
        </div>
        <button className="p-2 bg-slate-50 rounded-full text-indigo-600">
            <Phone className="w-5 h-5" />
        </button>
      </div>

      {/* Location Banner */}
      <div className="bg-indigo-50 px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-800">
        <MapPin className="w-3 h-3" />
        {request.location}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          const isSystem = msg.senderId === 'system';

          if (isSystem) {
             return (
                 <div key={msg.id} className="flex justify-center my-4">
                     <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                         {msg.text}
                     </span>
                 </div>
             )
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                isMe 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="flex-none p-3 bg-white border-t border-slate-100 pb-8">
        <div className="flex gap-2 mb-3">
             {!isRequester && (
                 <button 
                    onClick={handleInitialCompleteClick}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                 >
                    <CheckCircle className="w-4 h-4" /> Finalizar Sesión
                 </button>
             )}
        </div>
        <div className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveMatch;