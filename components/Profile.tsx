import React from 'react';
import { User } from '../types';
import { Trophy, Star, BookOpen, Settings } from 'lucide-react';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="pb-8">
      {/* Header / Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-10 pb-16 px-6 rounded-b-[2.5rem] relative">
        <div className="flex justify-between items-start text-white mb-4">
            <h2 className="text-xl font-bold">Mi Perfil</h2>
            <Settings className="w-5 h-5 opacity-80" />
        </div>
        <div className="flex items-center gap-4">
            <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl"
            />
            <div className="text-white">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-indigo-100 font-medium">{user.major}</p>
            </div>
        </div>
      </div>

      {/* Stats Cards - Overlapping */}
      <div className="px-6 -mt-10 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex justify-between items-center">
            <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Karma</div>
                <div className="text-3xl font-black text-amber-500 flex items-center gap-1 justify-center">
                    {user.karma} <Trophy className="w-5 h-5" />
                </div>
            </div>
            <div className="w-px h-12 bg-slate-100"></div>
            <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Rating</div>
                <div className="text-3xl font-black text-slate-800 flex items-center gap-1 justify-center">
                    4.9 <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
            </div>
        </div>
      </div>

      {/* Skills */}
      <div className="px-6 mb-8">
        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Habilidades
        </h3>
        <div className="flex flex-wrap gap-2">
            {user.skills.map(skill => (
                <span key={skill} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg border border-indigo-100">
                    {skill}
                </span>
            ))}
             <button className="px-4 py-2 border border-dashed border-slate-300 text-slate-400 rounded-lg font-medium text-sm">
                + Añadir
            </button>
        </div>
      </div>

      {/* Interests */}
      <div className="px-6 mb-8">
         <h3 className="font-bold text-slate-800 text-lg mb-4">Intereses de Estudio</h3>
         <div className="space-y-3">
            {user.interests.map(interest => (
                <div key={interest} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <span className="font-medium text-slate-700">{interest}</span>
                    <span className="text-xs text-slate-400">Cursando</span>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Profile;