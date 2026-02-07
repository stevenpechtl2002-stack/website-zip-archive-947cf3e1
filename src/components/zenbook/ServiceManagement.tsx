import React from 'react';
import { Clock, Euro, Tag, Sparkles } from 'lucide-react';
import { Service } from '@/types';

interface ServiceManagementProps {
  services: Service[];
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ services }) => {
  const categories = [...new Set(services.map((s) => s.category))];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Haare: 'bg-rose-100 text-rose-700 border-rose-200',
      Nägel: 'bg-purple-100 text-purple-700 border-purple-200',
      Kosmetik: 'bg-sky-100 text-sky-700 border-sky-200',
      Wellness: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Services</h2>
          <p className="text-slate-500 text-sm mt-1">Verwalte deine angebotenen Dienstleistungen</p>
        </div>
        <button className="zen-button-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Neuer Service
        </button>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {category}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services
              .filter((s) => s.category === category)
              .map((service) => (
                <div
                  key={service.id}
                  className="zen-card card-3d hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(
                        service.category
                      )}`}
                    >
                      {service.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-4">{service.name}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Euro className="w-4 h-4" />
                      <span>{service.price}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceManagement;
