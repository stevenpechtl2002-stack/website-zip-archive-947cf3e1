import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Briefcase, 
  PieChart, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Search as SearchIcon, 
  ChevronDown, 
  X, 
  ShieldAlert, 
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  Radio,
  Contact2,
  PanelLeftClose,
  PanelLeftOpen,
  Wand2
} from 'lucide-react';
import { 
  format, 
  isSameMonth, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  startOfDay,
  parseISO,
  addMonths,
  subMonths
} from 'date-fns';
import { de } from 'date-fns/locale';
import { ViewType, Appointment, AppointmentStatus, Staff, Service, UserRole } from '@/types';
import { 
  LandingPage,
  CalendarView, 
  ServiceManagement, 
  StaffManagement, 
  CustomerManagement, 
  Insights, 
  Settings as SettingsComponent, 
  CustomerPortal, 
  SalonRegistration 
} from '@/components/zenbook';
import { storageService } from '@/services/storageService';
import { SERVICES } from '@/constants';

const navItems = [
  { id: 'calendar', label: 'Kalender', icon: <CalendarIcon className="w-5 h-5" /> },
  { id: 'customers', label: 'Kunden', icon: <Contact2 className="w-5 h-5" /> },
  { id: 'services', label: 'Services', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'staff', label: 'Team', icon: <Users className="w-5 h-5" /> },
  { id: 'insights', label: 'KI Insights', icon: <PieChart className="w-5 h-5" /> },
  { id: 'settings', label: 'Einstellungen', icon: <SettingsIcon className="w-5 h-5" /> },
];

const ZenBookApp: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalType, setModalType] = useState<'appointment' | 'block' | null>(null);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [apiActivity, setApiActivity] = useState(false);

  const [newBooking, setNewBooking] = useState({
    staffId: '',
    hour: 9,
    customer: '',
    serviceId: '',
    blockReason: 'Pause',
    blockDuration: 60
  });

  useEffect(() => {
    storageService.init();
    setAppointments(storageService.getAppointments());
    setStaffMembers(storageService.getStaff());
    setServices(storageService.getServices());
  }, []);

  useEffect(() => {
    if (staffMembers.length > 0 && services.length > 0) {
      setNewBooking(prev => ({
        ...prev,
        staffId: staffMembers[0].id,
        serviceId: services[0].id
      }));
    }
  }, [staffMembers, services]);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { locale: de }),
    end: endOfWeek(endOfMonth(currentMonth), { locale: de })
  });

  const handleIncomingWebhook = (payload: any) => {
    setApiActivity(true);
    const matchedService = services.find(s => s.name.toLowerCase().includes(payload.serviceName.toLowerCase())) || services[0];
    const matchedStaff = staffMembers.find(s => s.name.toLowerCase().includes(payload.staffName.toLowerCase())) || staffMembers[0];
    
    if (!matchedService || !matchedStaff) return;
    
    const newApp: Appointment = {
      id: 'api-' + Math.random().toString(36).substr(2, 9),
      startTime: parseISO(payload.startTime),
      serviceId: matchedService.id,
      staffId: matchedStaff.id,
      customerName: payload.customerName,
      status: AppointmentStatus.CONFIRMED
    };
    storageService.saveAppointment(newApp);
    setAppointments(storageService.getAppointments());
    setSelectedDate(newApp.startTime);
    setCurrentView('calendar');
    setTimeout(() => setApiActivity(false), 3000);
  };

  const handleSave = () => {
    const bookingDate = startOfDay(selectedDate);
    bookingDate.setHours(newBooking.hour);
    const appData: Appointment = {
      id: editingAppointmentId || Math.random().toString(36).substr(2, 9),
      startTime: bookingDate,
      serviceId: modalType === 'block' ? 'block' : newBooking.serviceId,
      staffId: newBooking.staffId,
      customerName: modalType === 'block' ? newBooking.blockReason : newBooking.customer || 'Gast',
      isBlock: modalType === 'block',
      status: AppointmentStatus.CONFIRMED,
      durationOverride: modalType === 'block' ? newBooking.blockDuration : undefined
    };
    storageService.saveAppointment(appData);
    setAppointments(storageService.getAppointments());
    setModalType(null);
    setEditingAppointmentId(null);
  };

  // Login screens
  if (!userRole) {
    return <LandingPage onLogin={setUserRole} onStartRegistration={() => setUserRole('salon_registration')} />;
  }
  
  if (userRole === 'salon_registration') {
    return (
      <SalonRegistration 
        onComplete={() => { 
          storageService.init(); 
          setStaffMembers(storageService.getStaff()); 
          setUserRole('salon'); 
        }} 
        onCancel={() => setUserRole(null)} 
      />
    );
  }
  
  if (userRole === 'customer') {
    return <CustomerPortal onLogout={() => setUserRole(null)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden p-4 gap-6 relative">
      {/* 3D Floating Sidebar */}
      <aside className={`fixed lg:relative h-[calc(100vh-2rem)] z-50 flex flex-col gap-4 shrink-0 floating-3d rounded-[2.5rem] p-6 no-scrollbar transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0 lg:p-3 overflow-hidden'}`}>
        <div className={`flex items-center gap-3 mb-8 transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
          <div className="w-10 h-10 bg-indigo-50 border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-sm">
            Z
          </div>
          <h1 className={`text-xl font-black tracking-tighter text-slate-800 truncate ${!isSidebarOpen && 'hidden'}`}>ZenBook</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-bold text-sm group relative ${
                currentView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <span className="shrink-0">{React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}</span>
              <span className={`transition-all duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:w-0 overflow-hidden'}`}>{item.label}</span>
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className={`transition-all duration-300 ${!isSidebarOpen && 'lg:scale-0 lg:h-0 overflow-hidden'}`}>
          <div className={`p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 text-slate-500 mb-4 transition-all duration-700 ${apiActivity ? 'bg-emerald-50 border-emerald-100' : ''}`}>
            <div className="flex items-center gap-3">
              <Radio className={`w-4 h-4 ${apiActivity ? 'animate-pulse text-emerald-500' : 'text-slate-400'}`} />
              <div className="flex-1 overflow-hidden">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">API Gateway</p>
                <p className="text-xs font-bold text-slate-600 truncate">{apiActivity ? 'Requesting...' : 'Listening Mode'}</p>
              </div>
            </div>
          </div>

          <div className="relative mb-6">
            <button 
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="w-full flex items-center justify-between px-6 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Neu</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAddDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showAddDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 py-2 animate-in slide-in-from-bottom-2">
                <button onClick={() => { setModalType('appointment'); setShowAddDropdown(false); }} className="w-full flex items-center gap-3 px-5 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <CalendarIcon className="w-4 h-4" /> Termin
                </button>
                <button onClick={() => { setModalType('block'); setShowAddDropdown(false); }} className="w-full flex items-center gap-3 px-5 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <ShieldAlert className="w-4 h-4" /> Pause
                </button>
                <button onClick={() => setShowAddDropdown(false)} className="w-full flex items-center gap-3 px-5 py-4 text-xs font-bold text-indigo-600 hover:bg-indigo-50">
                  <Sparkles className="w-4 h-4" /> KI-Buchung
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Small Calendar at Bottom of Sidebar */}
        <div className={`mb-4 transition-all duration-300 ${!isSidebarOpen && 'lg:scale-0 lg:h-0 overflow-hidden'}`}>
           <div className="flex items-center justify-between px-2 mb-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy', { locale: de })}</span>
             <div className="flex gap-1">
               <ChevronLeft className="w-3 h-3 text-slate-300 cursor-pointer hover:text-slate-600" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} />
               <ChevronRight className="w-3 h-3 text-slate-300 cursor-pointer hover:text-slate-600" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} />
             </div>
           </div>
           <div className="grid grid-cols-7 gap-1">
             {calendarDays.map((day, idx) => (
               <div key={idx} className="flex items-center justify-center h-6 w-full relative">
                 <span className={`text-[10px] font-bold z-10 ${!isSameMonth(day, currentMonth) ? 'text-slate-200' : isSameDay(day, new Date()) ? 'text-white' : 'text-slate-500'}`}>
                   {format(day, 'd')}
                 </span>
                 {isSameDay(day, new Date()) && <div className="absolute inset-0 m-auto w-5 h-5 bg-indigo-600 rounded-full"></div>}
               </div>
             ))}
           </div>
        </div>

        <button 
          onClick={() => setUserRole(null)}
          className={`flex items-center gap-3 p-4 text-slate-400 hover:text-rose-500 transition-colors text-left w-full border-t border-slate-50 pt-6 ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={`text-xs font-black uppercase tracking-widest transition-all ${!isSidebarOpen && 'hidden'}`}>Logout</span>
        </button>
      </aside>

      {/* Main Container */}
      <main className={`flex-1 flex flex-col min-w-0 floating-3d rounded-[2.5rem] overflow-hidden rim-light transition-all duration-500`}>
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-slate-50 shrink-0 bg-white">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-xl border border-slate-100"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentView === 'calendar' ? 'Kalender' : navItems.find(i => i.id === currentView)?.label}
            </h2>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-600 border border-emerald-100 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input type="text" placeholder="Suche..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-all w-48" />
            </div>
            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-100"><Wand2 className="w-5 h-5" /></button>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm shrink-0">
               <img src="https://picsum.photos/seed/admin/100" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 relative no-scrollbar bg-white">
          {currentView === 'calendar' && (
            <CalendarView 
              appointments={appointments} 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onUpdateAppointment={(app) => { setEditingAppointmentId(app.id); setNewBooking({ ...newBooking, staffId: app.staffId, customer: app.customerName, hour: app.startTime.getHours() }); setModalType(app.isBlock ? 'block' : 'appointment'); }}
              onDeleteAppointment={(id) => { storageService.deleteAppointment(id); setAppointments(storageService.getAppointments()); }}
              staff={staffMembers}
              onSlotClick={(staffId, hour) => { setNewBooking({ ...newBooking, staffId, hour, customer: '' }); setModalType('appointment'); }}
            />
          )}
          {currentView === 'customers' && <CustomerManagement />}
          {currentView === 'services' && <ServiceManagement services={services} />}
          {currentView === 'staff' && <StaffManagement staff={staffMembers} onAddStaff={(s) => { 
            storageService.saveStaff(s);
            setStaffMembers(storageService.getStaff());
          }} />}
          {currentView === 'insights' && <Insights appointments={appointments} services={services} staff={staffMembers} />}
          {currentView === 'settings' && <SettingsComponent onSimulateIncoming={handleIncomingWebhook} />}
        </div>
      </main>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
        ></div>
      )}

      {/* Modern Dialog */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-10 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-2xl font-black text-slate-900 tracking-tight">{editingAppointmentId ? 'Bearbeiten' : 'Neue Buchung'}</h4>
               <button onClick={() => setModalType(null)} className="p-2 text-slate-400 hover:text-rose-500"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="zen-label ml-1">{modalType === 'block' ? 'Grund' : 'Kundenname'}</label>
                <input type="text" className="zen-input"
                  value={modalType === 'block' ? newBooking.blockReason : newBooking.customer} 
                  onChange={(e) => modalType === 'block' ? setNewBooking({...newBooking, blockReason: e.target.value}) : setNewBooking({...newBooking, customer: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="zen-label ml-1">Team</label>
                   <select className="zen-input" value={newBooking.staffId} onChange={e => setNewBooking({...newBooking, staffId: e.target.value})}>
                      {staffMembers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="zen-label ml-1">Uhrzeit</label>
                   <select className="zen-input" value={newBooking.hour} onChange={e => setNewBooking({...newBooking, hour: parseInt(e.target.value)})}>
                      {Array.from({length: 13}, (_, i) => i + 8).map(h => <option key={h} value={h}>{h}:00 Uhr</option>)}
                   </select>
                </div>
              </div>

              {modalType === 'appointment' && (
                <div className="space-y-2">
                  <label className="zen-label ml-1">Service</label>
                  <select className="zen-input" value={newBooking.serviceId} onChange={e => setNewBooking({...newBooking, serviceId: e.target.value})}>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} - €{s.price}</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button onClick={() => setModalType(null)} className="flex-1 zen-button-secondary">Abbrechen</button>
                <button onClick={handleSave} className="flex-[2] zen-button-primary">
                  Bestätigen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZenBookApp;
