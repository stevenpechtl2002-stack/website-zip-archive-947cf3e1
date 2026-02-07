import React, { useState } from 'react';
import { Search, Star, MapPin, LogOut, Calendar, Clock, Euro } from 'lucide-react';
import { SALONS, SERVICES } from '@/constants';
import { Salon } from '@/types';

interface CustomerPortalProps {
  onLogout: () => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  const categories = ['Alle', 'Haare', 'Nägel', 'Kosmetik', 'Wellness'];

  const filteredSalons = SALONS.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'Alle' || salon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedSalon) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedSalon(null)}
            className="mb-6 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            ← Zurück zur Suche
          </button>

          <div className="floating-3d rounded-[2rem] overflow-hidden">
            <img
              src={selectedSalon.image}
              alt={selectedSalon.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">{selectedSalon.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedSalon.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {selectedSalon.rating} ({selectedSalon.reviews} Bewertungen)
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-400">{selectedSalon.priceLevel}</span>
              </div>

              <h3 className="font-bold text-slate-900 mb-4">Verfügbare Services</h3>
              <div className="space-y-3">
                {SERVICES.filter((s) => s.category === selectedSalon.category).length > 0
                  ? SERVICES.filter((s) => s.category === selectedSalon.category).map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{service.name}</p>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <Euro className="w-4 h-4" />
                            {service.price}
                          </p>
                          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">
                            Buchen
                          </button>
                        </div>
                      </div>
                    ))
                  : SERVICES.slice(0, 3).map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{service.name}</p>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <Euro className="w-4 h-4" />
                            {service.price}
                          </p>
                          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">
                            Buchen
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xl">
              Z
            </div>
            <h1 className="text-xl font-black text-slate-900">ZenBook</h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Finde deinen perfekten Salon
          </h2>
          <p className="text-slate-500 text-lg">
            Entdecke und buche bei den besten Wellness & Beauty Studios
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Suche nach Salons, Orten oder Services..."
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-slate-200 shadow-lg outline-none font-medium focus:border-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Alle' ? null : cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                (cat === 'Alle' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Salons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalons.map((salon) => (
            <div
              key={salon.id}
              onClick={() => setSelectedSalon(salon)}
              className="floating-3d rounded-2xl overflow-hidden cursor-pointer card-3d"
            >
              <img src={salon.image} alt={salon.name} className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{salon.name}</h3>
                  <span className="text-sm font-bold text-slate-400">{salon.priceLevel}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {salon.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {salon.rating}
                  </span>
                </div>
                <span className="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                  {salon.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
