import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, Phone, Calendar, X } from 'lucide-react';
import { Customer } from '@/types';
import { storageService } from '@/services/storageService';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    setCustomers(storageService.getCustomers());
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) return;
    const customer: Customer = {
      id: 'c' + Math.random().toString(36).substr(2, 9),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      totalVisits: 0,
      avatar: `https://picsum.photos/seed/${newCustomer.name.toLowerCase().replace(/\s/g, '')}/200`,
    };
    storageService.saveCustomer(customer);
    setCustomers(storageService.getCustomers());
    setNewCustomer({ name: '', email: '', phone: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kunden</h2>
          <p className="text-slate-500 text-sm mt-1">{customers.length} registrierte Kunden</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="zen-button-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Neuer Kunde
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Kunden suchen..."
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium focus:border-indigo-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="zen-card card-3d">
            <div className="flex items-start gap-4">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900">{customer.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Phone className="w-3 h-3" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{customer.totalVisits} Besuche</span>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                Stammkunde
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-black text-slate-900">Neuer Kunde</h4>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="zen-label ml-1 mb-2 block">Name</label>
                <input
                  type="text"
                  className="zen-input"
                  placeholder="z.B. Max Mustermann"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <label className="zen-label ml-1 mb-2 block">E-Mail</label>
                <input
                  type="email"
                  className="zen-input"
                  placeholder="max@beispiel.de"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div>
                <label className="zen-label ml-1 mb-2 block">Telefon</label>
                <input
                  type="tel"
                  className="zen-input"
                  placeholder="+49 170 1234567"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowAddModal(false)} className="flex-1 zen-button-secondary">
                Abbrechen
              </button>
              <button onClick={handleAddCustomer} className="flex-[2] zen-button-primary">
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
