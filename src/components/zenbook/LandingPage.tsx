import React, { useState, useRef } from 'react';
import { UserRole } from '@/types';
import { Search, MapPin, ArrowRight, ChevronDown, Moon, Star, Clock, Sparkles, Heart, Play, Check } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface Props {
  onLogin: (role: UserRole) => void;
  onStartRegistration: () => void;
}

const LandingPage: React.FC<Props> = ({ onLogin, onStartRegistration }) => {
  const [searchTreatment, setSearchTreatment] = useState('');
  const [searchCity, setSearchCity] = useState('');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  const featuredSalons = [
    { 
      name: 'STUDIO NOIR', 
      category: 'Friseur',
      rating: 4.9,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
      price: 'Ab 45€'
    },
    { 
      name: 'Glow Aesthetics', 
      category: 'Kosmetik',
      rating: 4.8,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
      price: 'Ab 65€'
    },
    { 
      name: 'Zen Massage', 
      category: 'Wellness',
      rating: 5.0,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
      price: 'Ab 80€'
    },
    { 
      name: 'Nail Art Berlin', 
      category: 'Nails',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop',
      price: 'Ab 35€'
    },
  ];

  const businessFeatures = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'KI-Terminplanung', desc: 'Automatische Optimierung' },
    { icon: <Heart className="w-6 h-6" />, title: 'Kundenbindung', desc: 'Loyalitätsprogramme' },
    { icon: <Star className="w-6 h-6" />, title: 'Bewertungen', desc: 'Reputation aufbauen' },
  ];

  const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/30"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-violet-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">
              Z
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">ZenBook<span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">Beauty</span></span>
          </motion.div>
          
          <nav className="flex items-center gap-8">
            <motion.button 
              onClick={() => onLogin('customer')}
              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors hidden md:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Kunden Portal
            </motion.button>
            <motion.button 
              onClick={() => onLogin('salon')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-violet-600 text-white rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Business Login
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section with Background Image */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 relative overflow-hidden"
      >
        {/* Full Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=1080&fit=crop&q=80" 
            alt="Wellness Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background"></div>
        </div>

        {/* Floating 3D Elements */}
        <motion.div 
          className="absolute top-1/4 left-[10%] w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-violet-500/20 backdrop-blur-xl border border-white/20 shadow-2xl"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl border border-white/20 shadow-2xl"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-[20%] w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-white/20 shadow-2xl"
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="text-center relative z-10 max-w-5xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8"
          >
            Ready for your glow?
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-8"
          >
            <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
              Alles für dein
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-primary bg-clip-text text-transparent drop-shadow-2xl">
              Wohlbefinden
            </span>
            <span className="text-pink-500">.</span>
          </motion.h1>

          {/* Floating Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 bg-white/90 backdrop-blur-2xl rounded-full shadow-2xl shadow-primary/10 border border-white/50 p-2 flex items-center gap-2 max-w-2xl mx-auto"
            whileHover={{ scale: 1.02, boxShadow: "0 30px 60px -15px rgba(99, 102, 241, 0.2)" }}
          >
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
            <div className="w-px h-10 bg-border/50"></div>
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
            <motion.button 
              onClick={() => onLogin('customer')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-violet-600 text-white rounded-full text-xs font-black uppercase tracking-[0.1em] shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Suchen
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <p className="text-muted-foreground font-medium text-lg">
              Über <span className="text-foreground font-bold">5.000</span> verifizierte Salons. Einfach buchen, entspannt genießen.
            </p>
          </motion.div>

          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex items-center gap-2 mx-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </motion.button>
        </div>
      </motion.section>

      {/* Featured Salons - Treatwell Style */}
      <section className="py-32 px-6 lg:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">
                  Entdecken
                </p>
                <h2 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                  Die besten Salons<br />in deiner Nähe
                </h2>
              </div>
              <motion.button 
                className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 5 }}
              >
                Alle entdecken
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
          </AnimatedSection>

          {/* Salon Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSalons.map((salon, index) => (
              <AnimatedSection key={salon.name}>
                <motion.div 
                  className="group cursor-pointer"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onLogin('customer')}
                >
                  <div className="relative rounded-3xl overflow-hidden mb-4 shadow-lg">
                    <div className="aspect-[4/3] overflow-hidden">
                      <motion.img 
                        src={salon.image} 
                        alt={salon.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <motion.button 
                      className="absolute bottom-4 left-4 right-4 py-3 bg-white/90 backdrop-blur-xl rounded-xl text-xs font-black text-foreground opacity-0 group-hover:opacity-100 transition-all"
                      initial={{ y: 20 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      Jetzt buchen
                    </motion.button>
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-full flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-foreground">{salon.rating}</span>
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{salon.category}</p>
                    <h3 className="text-lg font-black text-foreground mb-1">{salon.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{salon.reviews} Bewertungen</p>
                      <p className="text-sm font-bold text-foreground">{salon.price}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section with Parallax */}
      <section className="py-32 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-4">
                  Inspiration
                </p>
                <h2 className="text-5xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                  Bereit für eine<br />Veränderung?
                </h2>
              </div>
              <motion.button 
                className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group"
                whileHover={{ x: 5 }}
              >
                Alle Styles entdecken
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
          </AnimatedSection>

          {/* Featured Category Card with Video Effect */}
          <AnimatedSection>
            <motion.div 
              className="relative rounded-[3rem] overflow-hidden h-[70vh] group cursor-pointer"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop&q=80" 
                alt="Friseur"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {/* Play Button */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </motion.div>

              <div className="absolute bottom-0 left-0 p-8 lg:p-16 text-white max-w-2xl">
                <motion.span 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-violet-600 rounded-full text-xs font-black uppercase tracking-[0.15em] mb-6 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  Kategorie: Friseur
                </motion.span>
                <h3 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6">
                  Exzellenz in<br />
                  <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">jedem Schnitt.</span>
                </h3>
                <p className="text-white/80 font-medium text-lg leading-relaxed">
                  Entdecke die besten Stylisten deiner Stadt und buche deinen Termin in Sekunden.
                </p>
              </div>

              {/* Floating Mini Card */}
              <motion.div 
                className="absolute bottom-8 right-8 w-72 bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl hidden lg:block"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Sofort buchbar</p>
                    <p className="text-white/60 text-sm">Freie Termine heute</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/40?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white/20" alt="" />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm">+127 heute gebucht</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Business Section - For Salons */}
      <section className="py-32 px-6 lg:px-12 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* 3D Floating Elements */}
        <motion.div 
          className="absolute top-20 right-[10%] w-40 h-40 rounded-[2rem] bg-gradient-to-br from-primary/10 to-violet-500/10 backdrop-blur-xl border border-white/10"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 left-[5%] w-28 h-28 rounded-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-xl border border-white/10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">
                  Für Geschäfte
                </p>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">Wachstum</span>
                  <br />als<br />
                  <span className="text-foreground">Standard.</span>
                </h2>
                <p className="mt-12 text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                  Die leistungsstärkste Suite für moderne Salons. Präsentiere deine Produkte und Services – wie bei den Besten der Branche.
                </p>

                {/* Feature Pills */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {businessFeatures.map((feature, i) => (
                    <motion.div 
                      key={feature.title}
                      className="flex items-center gap-3 px-5 py-3 bg-card rounded-full border border-border shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <span className="text-primary">{feature.icon}</span>
                      <span className="font-bold text-foreground text-sm">{feature.title}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  <motion.button 
                    onClick={() => onLogin('salon')}
                    className="px-10 py-5 bg-foreground text-background rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-xl hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Jetzt starten
                  </motion.button>
                  <motion.button 
                    onClick={onStartRegistration}
                    className="px-10 py-5 border-2 border-border text-foreground rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-muted transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Demo anfordern
                  </motion.button>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Product Showcase Cards - Treatwell Style */}
            <AnimatedSection>
              <div className="relative">
                {/* Main Product Card */}
                <motion.div 
                  className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-card border border-border"
                  whileHover={{ y: -10, rotateY: 2, rotateX: -2 }}
                  transition={{ duration: 0.4 }}
                  style={{ perspective: 1000 }}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop" 
                      alt="Wellness Treatment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-bold">4.9</span>
                        <span className="text-white/70 text-sm">(312 Bewertungen)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Signature Treatment</p>
                        <h4 className="text-xl font-black text-foreground">Aromatherapie Massage</h4>
                      </div>
                      <p className="text-2xl font-black text-foreground">89€</p>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>60 min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Sofort buchbar</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Stats Card */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-2xl border border-border z-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-4xl font-black bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">+127%</p>
                  <p className="text-sm font-bold text-muted-foreground mt-1">Durchschnittliches Wachstum</p>
                </motion.div>

                {/* Floating Product Mini Cards */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-48 bg-card rounded-2xl p-4 shadow-xl border border-border z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">Gesichtsbehandlung</p>
                      <p className="text-xs text-muted-foreground">Ab 65€</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 lg:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {[
              { value: '5.000+', label: 'Verifizierte Salons' },
              { value: '2M+', label: 'Zufriedene Kunden' },
              { value: '98%', label: 'Buchungsrate' },
              { value: '4.9', label: 'Durchschnittsbewertung' },
            ].map((stat, i) => (
              <AnimatedSection key={stat.label}>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-sm font-bold text-muted-foreground mt-2">{stat.label}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-12 border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
              Z
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">ZenBook<span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">Beauty</span></span>
          </motion.div>
          <p className="text-sm text-muted-foreground">© 2026 ZenBook Beauty. Alle Rechte vorbehalten.</p>
          <motion.button 
            className="p-3 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
