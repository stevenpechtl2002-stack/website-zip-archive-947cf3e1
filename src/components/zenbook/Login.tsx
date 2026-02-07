import React, { useState } from 'react';
import { Sparkles, Building2, User } from 'lucide-react';
import { UserRole } from '@/types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onStartRegistration: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onStartRegistration }) => {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="floating-3d rounded-[2.5rem] p-12 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-indigo-50 border border-slate-200 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-3xl shadow-sm mx-auto mb-6">
          Z
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Willkommen bei ZenBook
        </h1>
        <p className="text-slate-500 mb-10">
          Moderne Terminverwaltung für Wellness & Beauty
        </p>

        <div className="space-y-4">
          <button
            onClick={() => onLogin('salon')}
            onMouseEnter={() => setHoveredRole('salon')}
            onMouseLeave={() => setHoveredRole(null)}
            className={`w-full flex items-center gap-4 p-6 rounded-2xl border transition-all ${
              hoveredRole === 'salon'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200'
            }`}
          >
            <Building2 className="w-6 h-6" />
            <div className="text-left flex-1">
              <p className="font-bold">Salon Login</p>
              <p className={`text-sm ${hoveredRole === 'salon' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Verwalte dein Studio
              </p>
            </div>
            <Sparkles className={`w-5 h-5 ${hoveredRole === 'salon' ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
          </button>

          <button
            onClick={() => onLogin('customer')}
            onMouseEnter={() => setHoveredRole('customer')}
            onMouseLeave={() => setHoveredRole(null)}
            className={`w-full flex items-center gap-4 p-6 rounded-2xl border transition-all ${
              hoveredRole === 'customer'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-200'
            }`}
          >
            <User className="w-6 h-6" />
            <div className="text-left flex-1">
              <p className="font-bold">Kunden Portal</p>
              <p className={`text-sm ${hoveredRole === 'customer' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Buche deinen Termin
              </p>
            </div>
            <Sparkles className={`w-5 h-5 ${hoveredRole === 'customer' ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-sm text-slate-400 mb-4">Neu bei ZenBook?</p>
          <button
            onClick={onStartRegistration}
            className="text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors"
          >
            Salon registrieren →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
