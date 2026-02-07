import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Package, 
  Briefcase, 
  Users, 
  Check, 
  Plus, 
  X,
  Sparkles,
  MapPin,
  Info,
  Trash2,
  Euro,
  Clock
} from 'lucide-react';
import { Service, Product } from '@/types';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

const SalonRegistration: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Haare',
    location: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'
  });

  const [services, setServices] = useState<Partial<Service>[]>([
    { id: '1', name: 'Haarschnitt Standard', duration: 45, price: 35 }
  ]);
  const [products, setProducts] = useState<Partial<Product>[]>([
    { id: 'p1', name: 'Argan Oil Shampoo', brand: 'ZenCare', price: 24 }
  ]);

  // Temp states for adding new items
  const [newService, setNewService] = useState({ name: '', duration: 30, price: 0 });
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', price: 0 });
  const [showAddService, setShowAddService] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const addService = () => {
    if (!newService.name) return;
    setServices([...services, { ...newService, id: Math.random().toString(36).substr(2, 9) }]);
    setNewService({ name: '', duration: 30, price: 0 });
    setShowAddService(false);
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.brand) return;
    setProducts([...products, { ...newProduct, id: Math.random().toString(36).substr(2, 9), image: 'https://picsum.photos/seed/product/200' }]);
    setNewProduct({ name: '', brand: '', price: 0 });
    setShowAddProduct(false);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const steps = [
    { id: 1, label: 'Basis-Infos', icon: <Info className="w-5 h-5" /> },
    { id: 2, label: 'Galerie', icon: <Camera className="w-5 h-5" /> },
    { id: 3, label: 'Portfolio', icon: <Package className="w-5 h-5" /> },
    { id: 4, label: 'Abschluss', icon: <Check className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6">
      {/* Header & Stepper */}
      <div className="max-w-4xl w-full mb-12">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black shadow-xl">Z</div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Onboarding</h2>
          </div>
          <button onClick={onCancel} className="p-3 text-muted-foreground hover:text-destructive transition-all"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
          {steps.map(s => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${step >= s.id ? 'bg-primary border-primary/30 text-primary-foreground shadow-xl' : 'bg-card border-border text-muted-foreground'}`}>
                {step > s.id ? <Check className="w-6 h-6" /> : s.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full bg-card rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-border p-16 animate-in fade-in slide-in-from-bottom-8 duration-500 overflow-hidden">
        
        {step === 1 && (
          <div className="space-y-10">
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-foreground tracking-tight">Erzähl uns von deinem Salon</h3>
              <p className="text-muted-foreground font-medium">Diese Infos sehen deine Kunden auf dem Marktplatz.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Salon Name</label>
                <input 
                  type="text" 
                  className="w-full px-8 py-5 rounded-[2rem] bg-muted border-2 border-transparent focus:border-primary outline-none font-bold text-foreground transition-all"
                  placeholder="z.B. Hair & Soul Studio"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Kategorie</label>
                <select 
                  className="w-full px-8 py-5 rounded-[2rem] bg-muted border-2 border-transparent focus:border-primary outline-none font-bold text-foreground transition-all appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Haare</option>
                  <option>Nägel</option>
                  <option>Kosmetik</option>
                  <option>Wellness</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Standort</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-muted border-2 border-transparent focus:border-primary outline-none font-bold text-foreground transition-all"
                    placeholder="Straße, Hausnummer, Stadt"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Beschreibung</label>
                <textarea 
                  className="w-full px-8 py-6 rounded-[2rem] bg-muted border-2 border-transparent focus:border-primary outline-none font-bold text-foreground transition-all h-32 resize-none"
                  placeholder="Was macht deinen Salon besonders?"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <div className="space-y-2 text-center">
              <h3 className="text-4xl font-black text-foreground tracking-tight">Präsentiere deinen Style</h3>
              <p className="text-muted-foreground font-medium">Bilder sind das wichtigste Verkaufsargument.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group rounded-[3rem] overflow-hidden aspect-video shadow-2xl border-4 border-card">
                <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="p-5 bg-card rounded-full shadow-2xl"><Camera className="w-8 h-8 text-primary" /></button>
                </div>
              </div>
              <div className="flex flex-col justify-center p-10 bg-primary/10 rounded-[3rem] border border-primary/20">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h4 className="text-xl font-black text-foreground mb-2">Tipp vom Experten</h4>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  Helle, freundliche Bilder deines Interieurs erhöhen die Buchungsrate um bis zu 40%. Achte auf gute Belichtung!
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Oder Bild-URL einfügen (Demo)</label>
              <input 
                type="text" 
                className="w-full px-8 py-5 rounded-[2rem] bg-muted border-2 border-transparent focus:border-primary outline-none font-bold text-foreground transition-all"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 max-h-[60vh] overflow-y-auto pr-4 no-scrollbar">
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-foreground tracking-tight">Angebote erstellen</h3>
              <p className="text-muted-foreground font-medium">Füge deine Services und Verkaufsprodukte hinzu.</p>
            </div>

            <div className="space-y-8">
              {/* SERVICES SECTION */}
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-black text-foreground flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-primary" /> Dienstleistungen
                </h4>
                <button 
                  onClick={() => setShowAddService(!showAddService)}
                  className={`p-2 rounded-xl transition-all ${showAddService ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'}`}
                >
                  {showAddService ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>

              {showAddService && (
                <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 space-y-6 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Service Name (z.B. Balayage)" 
                      className="px-6 py-4 rounded-2xl bg-card border-2 border-transparent focus:border-primary outline-none font-bold text-sm"
                      value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}
                    />
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="number" placeholder="Min" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border-2 border-transparent focus:border-primary outline-none font-bold text-sm"
                          value={newService.duration} onChange={e => setNewService({...newService, duration: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="relative flex-1">
                        <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="number" placeholder="Preis" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border-2 border-transparent focus:border-primary outline-none font-bold text-sm"
                          value={newService.price} onChange={e => setNewService({...newService, price: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                  </div>
                  <button onClick={addService} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl">Dienstleistung hinzufügen</button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(s => (
                  <div key={s.id} className="p-6 bg-muted rounded-3xl flex justify-between items-center group hover:bg-card hover:shadow-xl border border-transparent hover:border-primary/10 transition-all">
                    <div>
                      <p className="font-black text-foreground">{s.name}</p>
                      <p className="text-xs font-bold text-muted-foreground">{s.duration} min • {s.price} €</p>
                    </div>
                    <button onClick={() => removeService(s.id!)} className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* PRODUCTS SECTION */}
              <div className="flex items-center justify-between pt-8 border-t border-border">
                <h4 className="text-xl font-black text-foreground flex items-center gap-3">
                  <Package className="w-6 h-6 text-emerald-600" /> Produkte & Shop
                </h4>
                <button 
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className={`p-2 rounded-xl transition-all ${showAddProduct ? 'bg-destructive/10 text-destructive' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                >
                  {showAddProduct ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>

              {showAddProduct && (
                <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 space-y-6 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Produkt Name" 
                      className="px-6 py-4 rounded-2xl bg-card border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-sm"
                      value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Marke" 
                      className="px-6 py-4 rounded-2xl bg-card border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-sm"
                      value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                    />
                    <div className="md:col-span-2 relative">
                      <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="number" placeholder="Verkaufspreis" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-sm"
                        value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <button onClick={addProduct} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl">Produkt hinzufügen</button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="p-6 bg-emerald-50/30 rounded-3xl flex justify-between items-center group border border-emerald-100 hover:bg-card hover:shadow-xl transition-all">
                    <div>
                      <p className="font-black text-emerald-900">{p.name}</p>
                      <p className="text-xs font-bold text-emerald-600">{p.brand} • {p.price} €</p>
                    </div>
                    <button onClick={() => removeProduct(p.id!)} className="p-2 text-emerald-200 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-10 py-10">
            <div className="w-32 h-32 bg-emerald-100 rounded-[3rem] flex items-center justify-center text-emerald-600 mx-auto shadow-2xl animate-bounce">
              <Check className="w-16 h-16 stroke-[3.5px]" />
            </div>
            <div className="space-y-4">
              <h3 className="text-5xl font-black text-foreground tracking-tight">Fast geschafft!</h3>
              <p className="text-xl text-muted-foreground font-medium max-w-lg mx-auto">
                Dein Salon "{formData.name || 'Mein Salon'}" ist bereit für den Launch. Wir haben {services.length} Services und {products.length} Produkte gespeichert.
              </p>
            </div>
            <div className="bg-muted p-8 rounded-[3rem] text-left border border-border">
               <div className="flex items-center gap-4 mb-4">
                 <Users className="w-6 h-6 text-primary" />
                 <span className="font-black text-foreground">Nächster Schritt</span>
               </div>
               <p className="text-sm text-muted-foreground font-bold">
                 Nach dem Abschluss landest du direkt in deinem Dashboard. Dort kannst du dein Team anlegen und deinen Kalender öffnen.
               </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-16 pt-10 border-t border-border flex items-center justify-between">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="px-10 py-5 rounded-[2rem] border-2 border-border text-muted-foreground font-black flex items-center gap-3 hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> Zurück
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="px-12 py-6 rounded-[2rem] bg-foreground text-background font-black flex items-center gap-4 hover:bg-primary transition-all shadow-2xl active:scale-95 disabled:opacity-50"
              disabled={step === 1 && !formData.name}
            >
              Weiter <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <button 
              onClick={onComplete}
              className="px-12 py-6 rounded-[2rem] bg-primary text-primary-foreground font-black flex items-center gap-4 hover:bg-primary/90 transition-all shadow-2xl active:scale-95"
            >
              Salon eröffnen <Sparkles className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonRegistration;