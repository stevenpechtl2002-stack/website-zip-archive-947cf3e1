import React, { useState } from 'react';
import { UserRole } from '@/types';
import { Search, MapPin, ArrowRight, ChevronDown, Moon } from 'lucide-react';

interface Props {
  onLogin: (role: UserRole) => void;
  onStartRegistration: () => void;
}

const LandingPage: React.FC<Props> = ({ onLogin, onStartRegistration }) => {
  const [searchTreatment, setSearchTreatment] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const categories = [
    { name: 'Friseur', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop' },
    { name: 'Kosmetik', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop' },
    { name: 'Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop' },
    { name: 'Nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg">
              Z
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">ZenBook<span className="text-primary">Beauty</span></span>
          </div>
          
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => onLogin('customer')}
              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
            >
              Kunden Portal
            </button>
            <button 
              onClick={() => onLogin('salon')}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all"
            >
              Business Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="text-center relative z-10 max-w-5xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8 animate-fade-in">
            Ready for your glow?
          </p>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight mb-8">
            <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Alles für dein
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-primary bg-clip-text text-transparent">
              Wohlbefinden
            </span>
            <span className="text-pink-500">.</span>
          </h1>

          {/* Search Bar */}
          <div className="mt-16 bg-card rounded-full shadow-2xl shadow-primary/10 border border-border p-3 flex items-center gap-4 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-3 px-6">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Welche Behandlung?"
                value={searchTreatment}
                onChange={(e) => setSearchTreatment(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-medium"
              />
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div className="flex-1 flex items-center gap-3 px-6">
              <MapPin className="w-5 h-5 text-pink-500" />
              <input 
                type="text"
                placeholder="In welcher Stadt?"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-medium"
              />
            </div>
            <button 
              onClick={() => onLogin('customer')}
              className="px-10 py-5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-primary/90 transition-all"
            >
              Suchen
            </button>
          </div>

          <p className="mt-16 text-muted-foreground font-medium text-lg max-w-xl mx-auto leading-relaxed">
            Über 5.000 verifizierte Salons. Einfach buchen, entspannt genießen.
          </p>
          <p className="text-foreground font-bold text-xl mt-2">
            Dein Termin, deine Zeit.
          </p>

          <button className="mt-8 flex items-center gap-2 mx-auto text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">
                Inspiration
              </p>
              <h2 className="text-5xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                Bereit für eine<br />Veränderung?
              </h2>
            </div>
            <button className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group">
              Alle Styles entdecken
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Featured Category Card */}
          <div className="relative rounded-[3rem] overflow-hidden h-[600px] group">
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=900&fit=crop" 
              alt="Friseur"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-12 text-white">
              <span className="inline-block px-6 py-3 bg-primary rounded-full text-xs font-black uppercase tracking-[0.15em] mb-6">
                Kategorie: Friseur
              </span>
              <h3 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
                Exzellenz in<br />
                <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">jedem Schnitt.</span>
              </h3>
              <p className="text-white/80 font-medium text-lg max-w-md leading-relaxed">
                Entdecke die besten Stylisten deiner Stadt und buche deinen Termin in Sekunden. Qualität, die man sieht und fühlt.
              </p>
            </div>
            {/* Mini Preview Card */}
            <div className="absolute bottom-8 right-8 w-64 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl hidden lg:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Alles für dein</p>
              <p className="text-sm font-black text-foreground">Wohlbefinden.</p>
              <div className="mt-2 w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => onLogin('customer')}
                className="relative rounded-3xl overflow-hidden h-48 group"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <span className="absolute bottom-4 left-4 text-white font-black text-lg">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="py-32 px-6 lg:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-6xl md:text-8xl font-black text-primary leading-[0.95] tracking-tight">
                Wachstum<br />als<br />
                <span className="text-foreground">Standard.</span>
              </h2>
              <p className="mt-12 text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                Die leistungsstärkste Suite für moderne Salons. Vollständig integriert in das exklusivste Buchungs-Netzwerk Deutschlands.
              </p>
              <div className="mt-12 flex flex-wrap gap-4">
                <button 
                  onClick={() => onLogin('salon')}
                  className="px-10 py-5 bg-foreground text-background rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-foreground/90 transition-all"
                >
                  Jetzt starten
                </button>
                <button 
                  onClick={onStartRegistration}
                  className="px-10 py-5 border-2 border-border text-foreground rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-muted transition-all"
                >
                  Demo anfordern
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=1000&fit=crop" 
                  alt="Wellness"
                  className="w-full h-auto"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-card rounded-3xl p-8 shadow-2xl border border-border">
                <p className="text-5xl font-black text-primary">+127%</p>
                <p className="text-sm font-bold text-muted-foreground mt-2">Durchschnittliches Wachstum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg">
              Z
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">ZenBook<span className="text-primary">Beauty</span></span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 ZenBook Beauty. Alle Rechte vorbehalten.</p>
          <button className="p-3 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <Moon className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
