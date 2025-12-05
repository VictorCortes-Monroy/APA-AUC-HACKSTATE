import React from 'react';
import { Home, User, Zap, MessageSquare, ShoppingBag } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'feed' | 'profile' | 'matches' | 'shop';
  onTabChange: (tab: 'feed' | 'profile' | 'matches' | 'shop') => void;
  karma: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, karma }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <header className="flex-none bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm z-10">
        <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            ApañaUC
            </h1>
            <p className="text-[10px] text-slate-400 font-medium -mt-1">El apañe que necesitas, al toque.</p>
        </div>
        <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="font-bold text-indigo-900 text-sm">{karma}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20 relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-none bg-white border-t border-slate-200 safe-area-bottom z-20">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => onTabChange('feed')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'feed' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-6 h-6" strokeWidth={activeTab === 'feed' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">Radar</span>
          </button>
          
          <button
            onClick={() => onTabChange('matches')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'matches' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
             <div className="relative">
                <MessageSquare className="w-6 h-6" strokeWidth={activeTab === 'matches' ? 2.5 : 2} />
                {/* Notification dot placeholder */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </div>
            <span className="text-[10px] mt-1 font-medium">Chats</span>
          </button>

          {/* New Shop Tab */}
          <button
            onClick={() => onTabChange('shop')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'shop' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingBag className="w-6 h-6" strokeWidth={activeTab === 'shop' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">Canje</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-6 h-6" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;