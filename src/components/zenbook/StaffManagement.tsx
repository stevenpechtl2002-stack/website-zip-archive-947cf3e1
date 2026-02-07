import React, { useState } from 'react';
import { Plus, User, X } from 'lucide-react';
import { Staff } from '@/types';

interface StaffManagementProps {
  staff: Staff[];
  onAddStaff: (staff: Staff) => void;
}

const STAFF_COLORS = [
  'bg-rose-100 border-rose-200 text-rose-700',
  'bg-emerald-100 border-emerald-200 text-emerald-700',
  'bg-indigo-100 border-indigo-200 text-indigo-700',
  'bg-amber-100 border-amber-200 text-amber-700',
  'bg-purple-100 border-purple-200 text-purple-700',
  'bg-sky-100 border-sky-200 text-sky-700',
];

const StaffManagement: React.FC<StaffManagementProps> = ({ staff, onAddStaff }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '' });

  const handleAdd = () => {
    if (!newStaff.name.trim() || !newStaff.role.trim()) return;
    const staffMember: Staff = {
      id: 's' + Math.random().toString(36).substr(2, 9),
      name: newStaff.name,
      role: newStaff.role,
      avatar: `https://picsum.photos/seed/${newStaff.name.toLowerCase().replace(/\s/g, '')}/200`,
      color: STAFF_COLORS[staff.length % STAFF_COLORS.length],
    };
    onAddStaff(staffMember);
    setNewStaff({ name: '', role: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Team</h2>
          <p className="text-slate-500 text-sm mt-1">Verwalte dein Salon-Team</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="zen-button-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Teammitglied hinzufügen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="zen-card card-3d">
            <div className="flex items-center gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                <p className="text-slate-500 text-sm">{member.role}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${member.color}`}>
                  Aktiv
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-black text-slate-900">Neues Teammitglied</h4>
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
                  placeholder="z.B. Sarah Müller"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                />
              </div>
              <div>
                <label className="zen-label ml-1 mb-2 block">Rolle</label>
                <input
                  type="text"
                  className="zen-input"
                  placeholder="z.B. Senior Stylist"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowAddModal(false)} className="flex-1 zen-button-secondary">
                Abbrechen
              </button>
              <button onClick={handleAdd} className="flex-[2] zen-button-primary">
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
