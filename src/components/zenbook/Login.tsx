import React, { useState } from 'react';
import { UserRole } from '@/types';
import { Briefcase, Heart, ArrowRight, ShieldCheck, Sparkles, User, Lock, Store } from 'lucide-react';

interface Props {
  onLogin: (role: UserRole) => void;
  onStartRegistration: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onStartRegistration }) => {
  const [activeTab, setActiveTab] = useState<'salon' | 'customer'>('customer');

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Branding & Info */}
        <div className="space-y-8 pr-0 lg:pr-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-[1.5rem] flex items-center justify-center text-primary-foreground font-black text-2xl shadow-2xl">
              Z
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">ZenBook</h1>
          </div>
          
          <h2 className="text-6xl font-black text-foreground leading-[1.1] tracking-tight">
            Wellness Management <br />
            <span className="gradient-text">Neu Definiert.</span>
          </h2>
          
          <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
            Die Komplettlösung für modernste Beautysalons und ihre Kunden. Intelligent, vernetzt und einfach schön.
          </p>

          <div className="flex gap-6 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://picsum.photos/seed/user${i}/100`} className="w-12 h-12 rounded-full border-4 border-background object-cover shadow-lg" alt="User" />
              ))}
            </div>
            <div>
              <p className="text-sm font-black text-foreground">+500 Salons</p>
              <p className="text-xs font-bold text-muted-foreground">vertrauen auf ZenBook</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="bg-card rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-border p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="flex bg-muted p-2 rounded-[2rem] mb-12">
            <button 
              onClick={() => setActiveTab('customer')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.6rem] text-sm font-black transition-all ${activeTab === 'customer' ? 'bg-card text-primary shadow-xl' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Heart className="w-4 h-4" /> Kunden Portal
            </button>
            <button 
              onClick={() => setActiveTab('salon')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.6rem] text-sm font-black transition-all ${activeTab === 'salon' ? 'bg-primary text-primary-foreground shadow-xl' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Briefcase className="w-4 h-4" /> Salon Pro
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">
                {activeTab === 'salon' ? 'Willkommen zurück, Partner' : 'Bereit für Entspannung?'}
              </h3>
              <p className="text-muted-foreground font-medium mt-2">Logge dich ein, um fortzufahren.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="Email Adresse" 
                  className="w-full pl-16 pr-8 py-5 rounded-[1.8rem] bg-muted border-2 border-transparent focus:border-primary focus:bg-card outline-none font-bold text-foreground shadow-inner transition-all"
                  defaultValue={activeTab === 'salon' ? 'salon@zenbook.de' : 'customer@relax.de'}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="Passwort" 
                  className="w-full pl-16 pr-8 py-5 rounded-[1.8rem] bg-muted border-2 border-transparent focus:border-primary focus:bg-card outline-none font-bold text-foreground shadow-inner transition-all"
                  defaultValue="password123"
                />
              </div>
            </div>

            <button 
              onClick={() => onLogin(activeTab)}
              className={`w-full py-6 rounded-[2rem] text-primary-foreground font-black text-lg shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${activeTab === 'salon' ? 'bg-foreground' : 'bg-primary'}`}
            >
              Einloggen
              <ArrowRight className="w-6 h-6" />
            </button>

            {activeTab === 'salon' && (
              <div className="pt-6 border-t border-border text-center">
                <p className="text-sm font-bold text-muted-foreground mb-6">Noch kein ZenBook Partner?</p>
                <button 
                  onClick={onStartRegistration}
                  className="w-full py-5 rounded-[2rem] border-2 border-border text-foreground font-black hover:bg-muted transition-all flex items-center justify-center gap-3"
                >
                  <Store className="w-5 h-5 text-primary" />
                  Salon registrieren
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure SSL
              </div>
              <div className="flex items-center gap-2 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-primary" /> AI Enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;