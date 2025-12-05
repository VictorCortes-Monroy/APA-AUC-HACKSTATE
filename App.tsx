import React, { useState } from 'react';
import Layout from './components/Layout';
import RequestCard from './components/RequestCard';
import CreateRequestModal from './components/CreateRequestModal';
import ActiveMatch from './components/ActiveMatch';
import Profile from './components/Profile';
import CampusMap from './components/CampusMap';
import ShopDashboard from './components/ShopDashboard'; // New Component
import { User, HelpRequest, RequestStatus } from './types';
import { Plus, List, Map, Filter, XCircle } from 'lucide-react';
import { calculateRewards } from './services/gamification';

// --- MOCK DATA ---
const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  avatar: 'https://picsum.photos/200/300',
  karma: 120,
  skills: ['Python', 'Inglés', 'Edición Video'],
  interests: ['Cálculo I', 'Historia'],
  major: 'Ingeniería Informática',
  // Gamification Data
  level: 5,
  currentXp: 850,
  nextLevelXp: 1200,
  streakDays: 4,
  totalHelps: 23,
  badges: [
      { id: 'b1', name: 'Primeros Pasos', description: 'Completa tu primera tutoría.', icon: '🚀', unlocked: true },
      { id: 'b2', name: 'Salvavidas', description: 'Ayuda a 10 personas en exámenes.', icon: '🛟', unlocked: true },
      { id: 'b3', name: 'Cerebro Colectivo', description: 'Genera 5 soluciones IA.', icon: '🧠', unlocked: false },
      { id: 'b4', name: 'Racha Semanal', description: 'Ayuda 7 días seguidos.', icon: '🔥', unlocked: false },
  ]
};

const INITIAL_REQUESTS: HelpRequest[] = [
  {
    id: 'r1',
    requesterId: 'u2',
    requesterName: 'Sofia M.',
    requesterAvatar: 'https://picsum.photos/201/300',
    requesterMajor: 'Artes Visuales', 
    preferredMajor: 'Ingeniería / Ciencias', // Cross-faculty preference
    topic: 'Física I',
    description: 'Necesito ayuda con los diagramas de cuerpo libre para una escultura móvil.',
    location: 'Biblioteca - Piso 2',
    offer: '15 min Karma',
    status: RequestStatus.PENDING,
    timestamp: Date.now() - 120000,
    tags: ['Física', 'Mecánica', 'Escultura']
  },
  {
    id: 'r2',
    requesterId: 'u3',
    requesterName: 'Juan P.',
    requesterAvatar: 'https://picsum.photos/202/300',
    requesterMajor: 'Ingeniería Civil', 
    preferredMajor: 'Cualquiera (Más rápido)',
    topic: 'Estadística',
    description: 'Alguien sabe usar R Studio para una regresión?',
    location: 'Cafetería Central',
    offer: 'Un Café',
    status: RequestStatus.PENDING,
    timestamp: Date.now() - 600000,
    tags: ['R', 'Estadística']
  },
  {
    id: 'r3',
    requesterId: 'u4',
    requesterName: 'Marta L.',
    requesterAvatar: 'https://picsum.photos/203/300',
    requesterMajor: 'Derecho',
    preferredMajor: 'Filosofía / Letras',
    topic: 'Ensayo Ética',
    description: 'Revisión rápida de argumentos para mi ensayo.',
    location: 'Biblioteca - Piso 2', 
    offer: '15 min Karma',
    status: RequestStatus.PENDING,
    timestamp: Date.now() - 1800000,
    tags: ['Escritura', 'Ética']
  },
    {
    id: 'r4',
    requesterId: 'u5',
    requesterName: 'Carlos D.',
    requesterAvatar: 'https://picsum.photos/204/300',
    requesterMajor: 'Arquitectura',
    preferredMajor: 'Artes / Diseño',
    topic: 'Maqueta 3D',
    description: 'Ayuda cortando cartón pluma, no termino!',
    location: 'Biblioteca - Piso 2',
    offer: 'Un Café',
    status: RequestStatus.PENDING,
    timestamp: Date.now() - 50000,
    tags: ['Maquetas']
  },
      {
    id: 'r5',
    requesterId: 'u6',
    requesterName: 'Ana B.',
    requesterAvatar: 'https://picsum.photos/205/300',
    requesterMajor: 'Medicina',
    preferredMajor: 'Ingeniería / Ciencias',
    topic: 'Bioquímica',
    description: 'Ciclo de Krebs, auxilio. Necesito mnemotecnias.',
    location: 'Biblioteca - Piso 2',
    offer: '15 min Karma',
    status: RequestStatus.PENDING,
    timestamp: Date.now() - 100000,
    tags: ['Biología', 'Química']
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'matches' | 'shop'>('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map'); 
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_REQUESTS);
  const [activeRequest, setActiveRequest] = useState<HelpRequest | null>(null);
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Derive unique tags from current requests
  const availableTags = Array.from(new Set(requests.flatMap(r => r.tags))).sort();

  // Handle Creating a Request
  const handleCreateRequest = (data: { description: string; location: string; offer: string; tags: string[]; topic: string; preferredMajor: string }) => {
    const newRequest: HelpRequest = {
      id: Date.now().toString(),
      requesterId: user.id,
      requesterName: user.name,
      requesterAvatar: user.avatar,
      requesterMajor: user.major,
      preferredMajor: data.preferredMajor,
      topic: data.topic,
      description: data.description,
      location: data.location,
      offer: data.offer,
      status: RequestStatus.PENDING,
      timestamp: Date.now(),
      tags: data.tags
    };

    setRequests([newRequest, ...requests]);
  };

  // Handle Accepting a Request (As a Helper)
  const handleAcceptRequest = (request: HelpRequest) => {
    const updatedRequest = { ...request, status: RequestStatus.MATCHED, helperId: user.id };
    setActiveRequest(updatedRequest);
    
    // Update local list
    setRequests(requests.map(r => r.id === request.id ? updatedRequest : r));
    
    // Switch to match view
    setActiveTab('matches');
  };

  // Handle Completing a Session
  const handleCompleteSession = (extraBonus: number = 0) => {
    if (activeRequest) {
      // Calculate reward logic locally for instant feedback updates
      const reward = calculateRewards(activeRequest.requesterMajor, user.major);
      const totalPoints = reward.points + extraBonus;
      
      setUser(prev => ({ 
          ...prev, 
          karma: prev.karma + totalPoints,
          currentXp: prev.currentXp + totalPoints, // Add XP too
          totalHelps: prev.totalHelps + 1
      }));
      setActiveRequest(null);
      setActiveTab('feed');
      // Remove completed request from feed
      setRequests(requests.filter(r => r.id !== activeRequest.id));
    }
  };

  const handleRedeemReward = (cost: number, itemName: string) => {
      if (user.karma >= cost) {
          setUser(prev => ({ ...prev, karma: prev.karma - cost }));
          alert(`¡Canjeado! Muestra este mensaje para recibir: ${itemName}`);
      }
  };

  const handleZoneClick = (location: string) => {
      setFilterLocation(location);
      setViewMode('list'); // Switch to list view to show details of that zone
  };

  // Filter requests for the list view
  const visibleRequests = requests.filter(req => {
      const matchLoc = filterLocation ? req.location === filterLocation : true;
      const matchTag = filterTag ? req.tags.includes(filterTag) : true;
      return matchLoc && matchTag;
  });

  // Render Content based on View
  const renderContent = () => {
    if (activeTab === 'shop') {
        return <ShopDashboard user={user} onRedeem={handleRedeemReward} />;
    }

    if (activeTab === 'matches') {
      if (activeRequest) {
        return (
          <ActiveMatch 
            request={activeRequest} 
            currentUser={user} 
            onComplete={handleCompleteSession} 
          />
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <Plus className="w-8 h-8 text-slate-300" />
            </div>
            <p>No tienes chats activos.</p>
            <button 
                onClick={() => setActiveTab('feed')}
                className="mt-4 text-indigo-600 font-semibold"
            >
                Buscar a quién ayudar
            </button>
          </div>
        );
      }
    }

    if (activeTab === 'profile') {
      return (
        <div className="relative">
             <Profile user={user} />
             {/* Simple link to Shop inside Profile */}
             <div className="px-6 pb-6">
                 <button 
                    onClick={() => setActiveTab('shop')}
                    className="w-full bg-slate-900 text-white p-4 rounded-xl shadow-lg font-bold"
                 >
                     Ir a Tienda de Canje
                 </button>
             </div>
        </div>
      );
    }

    // Default: Feed (Radar)
    return (
      <div className="p-4 pb-24">
        {/* Top Controls */}
        <div className="flex flex-col gap-3 mb-4">
            <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {filterLocation ? `Zona: ${filterLocation}` : 'Radar del Campus'}
                </h2>
                
                <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                    <button 
                        onClick={() => { setViewMode('map'); setFilterLocation(null); }}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}
                    >
                        <Map className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tag Filter (Scrollable) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
                <div className="flex items-center text-slate-400 text-xs font-medium sticky left-0 bg-slate-50 z-10 pr-2">
                    <Filter className="w-3 h-3 mr-1" /> Filtros:
                </div>
                
                {/* Reset Filter */}
                {filterTag && (
                    <button 
                        onClick={() => setFilterTag(null)}
                        className="flex-none flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200 whitespace-nowrap"
                    >
                        <XCircle className="w-3 h-3" /> Borrar
                    </button>
                )}

                {availableTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                        className={`flex-none px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                            filterTag === tag
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>

        {viewMode === 'map' && (
            <CampusMap requests={visibleRequests} onZoneClick={handleZoneClick} />
        )}
        
        {viewMode === 'list' && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                {filterLocation && (
                    <button 
                        onClick={() => { setFilterLocation(null); setViewMode('map'); }}
                        className="mb-4 text-xs font-bold text-indigo-600 flex items-center hover:underline"
                    >
                        ← Volver al Mapa
                    </button>
                )}
                
                {visibleRequests.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No se encontraron solicitudes con estos filtros.</p>
                        {filterTag && (
                            <button onClick={() => setFilterTag(null)} className="text-indigo-500 text-sm mt-2 font-medium">
                                Limpiar etiquetas
                            </button>
                        )}
                    </div>
                ) : (
                    visibleRequests.map(req => (
                    <RequestCard 
                        key={req.id} 
                        request={req} 
                        onAccept={handleAcceptRequest}
                        isOwnRequest={req.requesterId === user.id}
                    />
                    ))
                )}
            </div>
        )}
        
        {/* Helper text for pitch */}
        {viewMode === 'map' && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-800">
                <p className="font-bold mb-1">🔥 ¡Alerta de Bonus!</p>
                <p>La Biblioteca está en llamas ({requests.filter(r => r.location.includes('Biblioteca')).length} personas necesitan ayuda). ¡Ve allí para ganar el <span className="font-bold">Bono Multiplicador x1.5</span>!</p>
            </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} karma={user.karma}>
        {renderContent()}
      </Layout>

      {/* Floating Action Button (Only on Feed) */}
      {activeTab === 'feed' && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 bg-slate-900 text-white w-14 h-14 rounded-full shadow-xl shadow-slate-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      {/* Request Modal */}
      <CreateRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRequest}
      />
    </>
  );
};

export default App;