import React from 'react';
import { storageService } from '@/services/storageService';
import { Search, Mail, Phone, Calendar, MoreVertical, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const CustomerManagement: React.FC = () => {
  const customers = storageService.getCustomers();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-4xl font-black text-foreground tracking-tight">Kundenstamm</h3>
          <p className="text-muted-foreground font-medium mt-2">Verwalte deine loyale Community und analysiere das Buchungsverhalten.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-6 py-4 rounded-[1.8rem] border border-emerald-100 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Wachstum</p>
              <p className="text-lg font-black text-foreground">+14%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-[3.5rem] shadow-2xl border border-border overflow-hidden">
        <div className="p-8 border-b border-border flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Kunden suchen..." 
              className="w-full pl-16 pr-8 py-4 bg-muted rounded-2xl border-none font-bold text-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kunde</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kontakt</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Besuche</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Umsatz</th>
                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Letzter Besuch</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map(customer => (
                <tr key={customer.id} className="group hover:bg-muted/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-foreground">{customer.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-4 py-2 bg-muted rounded-xl text-xs font-black text-foreground">
                      {customer.bookingsCount}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-foreground">{customer.totalSpent.toFixed(2)} €</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd. MMM yyyy', { locale: de }) : 'Nie'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;