import React from 'react';
import { User } from '../types';
import { Flame, Trophy, Lock, Zap, Coffee, Printer, Ticket, CheckCircle2, ChevronRight } from 'lucide-react';

interface ShopDashboardProps {
  user: User;
  onRedeem: (cost: number, itemName: string) => void;
}

const ShopDashboard: React.FC<ShopDashboardProps> = ({ user, onRedeem }) => {
  const progressPercent = (user.currentXp / user.nextLevelXp) * 100;

  const rewards = [
    { id: 1, name: 'Café Americano', cost: 150, icon: <Coffee className="w-5 h-5" />, color: 'bg-amber-100 text-amber-700' },
    { id: 2, name: '10 Impresiones', cost: 100, icon: <Printer className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-700' },
    { id: 3, name: 'Red Bull', cost: 250, icon: <Zap className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700' },
    { id: 4, name: 'Ticket Cine 2x1', cost: 500, icon: <Ticket className="w-5 h-5" />, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Bank */}
      <div className="bg-slate-900 text-white p-6 rounded-b-[2rem] shadow-xl relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Trophy className="w-48 h-48" />
         </div>

         <div className="relative z-10">
            <h2 className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-1">Tu Saldo Karma</h2>
            <div className="flex items-center gap-2 mb-6">
                <Zap className="w-8 h-8 text-amber-400 fill-amber-400" />
                <span className="text-5xl font-black tracking-tight">{user.karma}</span>
            </div>

            {/* Level Progress */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-xs text-slate-400 block mb-0.5">Nivel Actual</span>
                        <span className="font-bold text-lg text-indigo-400">Nivel {user.level}: Mentor Jr.</span>
                    </div>
                    <span className="text-xs text-slate-500">{user.currentXp} / {user.nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>
         </div>
      </div>

      {/* 2. Streak & Stats */}
      <div className="px-4 -mt-6 mb-6 relative z-20">
         <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                    <Flame className={`w-6 h-6 text-orange-600 ${user.streakDays > 0 ? 'animate-pulse' : ''}`} fill={user.streakDays > 0 ? "currentColor" : "none"} />
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-800">{user.streakDays} Días</div>
                    <div className="text-xs text-slate-500 font-medium">Racha de Ayuda</div>
                </div>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
             <div className="flex items-center gap-3 pr-4">
                <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{user.totalHelps}</div>
                    <div className="text-xs text-slate-500 font-medium">Estudiantes Salvados</div>
                </div>
            </div>
         </div>
      </div>

      {/* 3. Marketplace (Tienda) */}
      <div className="px-5 mb-8">
        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-indigo-600" /> Canjear Recompensas
        </h3>
        <div className="grid grid-cols-2 gap-3">
            {rewards.map(item => {
                const canAfford = user.karma >= item.cost;
                return (
                    <button 
                        key={item.id}
                        disabled={!canAfford}
                        onClick={() => onRedeem(item.cost, item.name)}
                        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                            canAfford 
                            ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm active:scale-95' 
                            : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.color}`}>
                            {item.icon}
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.name}</h4>
                        <p className={`text-xs font-bold ${canAfford ? 'text-amber-600' : 'text-slate-400'}`}>
                            {item.cost} Pts
                        </p>
                        
                        {canAfford && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
      </div>

      {/* 4. Achievements (Logros) */}
      <div className="px-5">
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" /> Logros
            </h3>
            <span className="text-xs font-bold text-slate-400">
                {user.badges.filter(b => b.unlocked).length}/{user.badges.length} Desbloqueados
            </span>
         </div>
         
         <div className="space-y-3">
            {user.badges.map(badge => (
                <div 
                    key={badge.id} 
                    className={`flex items-center gap-4 p-3 rounded-xl border ${
                        badge.unlocked 
                        ? 'bg-white border-indigo-100 shadow-sm' 
                        : 'bg-slate-50 border-slate-100 grayscale opacity-70'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                        badge.unlocked ? 'bg-indigo-50' : 'bg-slate-200'
                    }`}>
                        {badge.unlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                        <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                            {badge.name}
                        </h4>
                        <p className="text-xs text-slate-500 leading-snug">
                            {badge.description}
                        </p>
                    </div>
                    {badge.unlocked && (
                         <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Completed</div>
                    )}
                </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default ShopDashboard;