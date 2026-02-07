import React, { useState, useRef } from 'react';
import { 
  format, 
  isSameDay, 
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns';
import { de } from 'date-fns/locale';
import { SERVICES, BUSINESS_HOURS } from '@/constants';
import { Appointment, Staff } from '@/types';
import { Plus, ChevronLeft, ChevronRight, LayoutGrid, CalendarDays, Clock } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onUpdateAppointment: (app: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  staff: Staff[];
  onSlotClick: (staffId: string, hour: number) => void;
}

const CalendarView: React.FC<Props> = ({ 
  appointments, 
  selectedDate, 
  setSelectedDate, 
  onUpdateAppointment,
  staff,
  onSlotClick
}) => {
  const hours = Array.from({ length: BUSINESS_HOURS.end - BUSINESS_HOURS.start }, (_, i) => i + BUSINESS_HOURS.start);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedStaffId] = useState<string>(staff[0]?.id || '');
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartRef = useRef<number | null>(null);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { locale: de }),
    end: endOfWeek(selectedDate, { locale: de })
  });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      setIsSwiping(true);
      if (diff > 0) {
        setSelectedDate(addDays(selectedDate, viewMode === 'day' ? 1 : 7));
      } else {
        setSelectedDate(addDays(selectedDate, viewMode === 'day' ? -1 : -7));
      }
      setTimeout(() => setIsSwiping(false), 300);
    }
    touchStartRef.current = null;
  };

  return (
    <div 
      className={`h-full flex flex-col transition-all duration-300 ${isSwiping ? 'opacity-50 scale-[0.995]' : 'opacity-100'}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Refined Calendar Header matching screenshot */}
      <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <h3 className="text-4xl font-black text-foreground tracking-tighter">
            {format(selectedDate, 'EEEE, d. MMMM', { locale: de })}
          </h3>
          <div className="flex gap-1 bg-muted p-1.5 rounded-[1.2rem] border border-border shadow-sm">
            <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} className="p-2 hover:bg-card hover:shadow-sm rounded-xl text-muted-foreground transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setSelectedDate(new Date())} className="px-5 py-2 text-[11px] font-black text-primary hover:bg-card hover:shadow-sm rounded-xl transition-all">Heute</button>
            <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-card hover:shadow-sm rounded-xl text-muted-foreground transition-all"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-muted p-1.5 rounded-[1.2rem] flex border border-border shadow-sm">
            <button onClick={() => setViewMode('day')} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${viewMode === 'day' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutGrid className="w-4 h-4" /> TAG
            </button>
            <button onClick={() => setViewMode('week')} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${viewMode === 'week' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
              <CalendarDays className="w-4 h-4" /> WOCHE
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-[2rem] overflow-hidden flex flex-col shadow-sm relative">
        <div className="flex border-b border-border bg-card sticky top-0 z-20 h-20 items-center">
          <div className="w-20 border-r border-border shrink-0"></div>
          {viewMode === 'day' ? (
            staff.map(person => (
              <div key={person.id} className="flex-1 px-6 flex items-center gap-4 border-r border-border last:border-r-0 min-w-[150px]">
                <div className="w-10 h-10 rounded-[1.2rem] overflow-hidden border border-border bg-card shrink-0 shadow-sm">
                  <img src={person.avatar} className="w-full h-full object-cover" alt={person.name} />
                </div>
                <p className="font-black text-foreground text-sm tracking-tight truncate">{person.name}</p>
              </div>
            ))
          ) : (
            weekDays.map(day => (
              <div key={day.toString()} className={`flex-1 flex flex-col justify-center text-center border-r border-border last:border-r-0 min-w-[100px] ${isSameDay(day, new Date()) ? 'bg-primary/10' : ''}`}>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{format(day, 'EEE', { locale: de })}</p>
                <p className={`text-xl font-black ${isSameDay(day, new Date()) ? 'text-primary' : 'text-foreground'}`}>{format(day, 'd')}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex-1 overflow-y-auto relative no-scrollbar">
          <div className="flex min-h-[1000px]">
            <div className="w-20 border-r border-border bg-card/30 shrink-0">
              {hours.map(hour => (
                <div key={hour} className="h-28 px-4 pt-6 text-[10px] font-black text-muted-foreground text-right pr-6">{hour}:00</div>
              ))}
            </div>

            {viewMode === 'day' ? (
              staff.map(person => (
                <div key={person.id} className="flex-1 relative border-r border-border last:border-r-0 min-w-[150px]">
                  {hours.map(hour => (
                    <div key={hour} onClick={() => onSlotClick(person.id, hour)} className="h-28 border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer group flex items-start justify-center pt-6">
                       <Plus className="w-5 h-5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  {appointments.filter(a => a.staffId === person.id && isSameDay(a.startTime, selectedDate)).map(app => (
                    <AppointmentCard key={app.id} app={app} onEdit={onUpdateAppointment} cellHeight={112} />
                  ))}
                </div>
              ))
            ) : (
              weekDays.map(day => (
                <div key={day.toString()} className="flex-1 relative border-r border-border last:border-r-0 min-w-[100px]">
                  {hours.map(hour => (
                    <div key={hour} onClick={() => onSlotClick(selectedStaffId, hour)} className="h-28 border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer group flex items-start justify-center pt-6">
                       <Plus className="w-5 h-5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  {appointments.filter(a => a.staffId === selectedStaffId && isSameDay(a.startTime, day)).map(app => (
                    <AppointmentCard key={app.id} app={app} onEdit={onUpdateAppointment} cellHeight={112} />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentCard: React.FC<{ app: Appointment, onEdit: (app: Appointment) => void, cellHeight: number }> = ({ app, onEdit, cellHeight }) => {
  const startHour = app.startTime.getHours();
  const startMin = app.startTime.getMinutes();
  const top = ((startHour - BUSINESS_HOURS.start) * cellHeight) + (startMin / 60 * cellHeight);
  const service = SERVICES.find(s => s.id === app.serviceId);
  const duration = app.isBlock ? (app.durationOverride || 60) : (service?.duration || 60);
  const height = (duration / 60) * cellHeight;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onEdit(app); }}
      className={`absolute left-2 right-2 rounded-[1.2rem] p-5 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] border-l-[6px] transition-all cursor-pointer z-10 group overflow-hidden active:scale-[0.98]
        ${app.isBlock ? 'bg-muted border-muted-foreground shadow-none' : 'bg-card border-primary'}
      `}
      style={{ top: `${top + 4}px`, height: `${height - 8}px` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 opacity-40">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{format(app.startTime, 'HH:mm')}</span>
        </div>
      </div>
      <p className={`font-black text-sm truncate leading-tight mb-1 ${app.isBlock ? 'text-muted-foreground' : 'text-foreground'}`}>{app.customerName}</p>
      {!app.isBlock && <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">{service?.name}</p>}
    </div>
  );
};

export default CalendarView;