import React from 'react';
import { TrendingUp, Users, Calendar, Euro, Sparkles, Clock, Star } from 'lucide-react';
import { Appointment, Service, Staff, AppointmentStatus } from '@/types';

interface InsightsProps {
  appointments: Appointment[];
  services: Service[];
  staff: Staff[];
}

const Insights: React.FC<InsightsProps> = ({ appointments, services, staff }) => {
  const confirmedAppointments = appointments.filter(
    (a) => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.COMPLETED
  );

  const totalRevenue = confirmedAppointments.reduce((sum, app) => {
    const service = services.find((s) => s.id === app.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  const avgAppointmentsPerDay = (confirmedAppointments.length / 7).toFixed(1);

  const mostBookedService = services.reduce(
    (best, service) => {
      const count = appointments.filter((a) => a.serviceId === service.id).length;
      return count > best.count ? { service, count } : best;
    },
    { service: services[0], count: 0 }
  );

  const topPerformer = staff.reduce(
    (best, member) => {
      const count = appointments.filter((a) => a.staffId === member.id).length;
      return count > best.count ? { member, count } : best;
    },
    { member: staff[0], count: 0 }
  );

  const stats = [
    {
      label: 'Wochenübersicht',
      value: `€${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: <Euro className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Termine',
      value: confirmedAppointments.length.toString(),
      change: '+8 diese Woche',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      label: 'Ø pro Tag',
      value: avgAppointmentsPerDay,
      change: 'Termine',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Teammitglieder',
      value: staff.length.toString(),
      change: 'Aktiv',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">KI Insights</h2>
          <p className="text-slate-500 text-sm">Intelligente Analysen für dein Business</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="zen-card card-3d">
            <div className={`inline-flex p-3 rounded-xl border ${stat.color} mb-4`}>
              {stat.icon}
            </div>
            <p className="zen-label mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="zen-card">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900">Top Service</h3>
          </div>
          {mostBookedService.service && (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl">
                #{1}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">{mostBookedService.service.name}</p>
                <p className="text-slate-500 text-sm">{mostBookedService.count} Buchungen</p>
              </div>
            </div>
          )}
        </div>

        <div className="zen-card">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Top Performer</h3>
          </div>
          {topPerformer.member && (
            <div className="flex items-center gap-4">
              <img
                src={topPerformer.member.avatar}
                alt={topPerformer.member.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div>
                <p className="font-bold text-slate-900 text-lg">{topPerformer.member.name}</p>
                <p className="text-slate-500 text-sm">{topPerformer.count} Termine diese Woche</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Tips */}
      <div className="zen-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">KI Empfehlung</h3>
            <p className="text-white/80 leading-relaxed">
              Basierend auf deinen Daten: Die Nachmittagsstunden zwischen 14-16 Uhr sind weniger ausgelastet.
              Erwäge spezielle Angebote für diese Zeiten, um die Auslastung zu erhöhen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
