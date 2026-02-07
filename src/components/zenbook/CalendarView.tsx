import React from 'react';
import { format, isSameDay, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Trash2, Edit3 } from 'lucide-react';
import { Appointment, Staff, AppointmentStatus } from '@/types';
import { SERVICES, BUSINESS_HOURS } from '@/constants';

interface CalendarViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  staff: Staff[];
  onSlotClick: (staffId: string, hour: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  selectedDate,
  setSelectedDate,
  onUpdateAppointment,
  onDeleteAppointment,
  staff,
  onSlotClick,
}) => {
  const hours = Array.from(
    { length: BUSINESS_HOURS.end - BUSINESS_HOURS.start },
    (_, i) => i + BUSINESS_HOURS.start
  );

  const getAppointmentsForSlot = (staffId: string, hour: number) => {
    return appointments.filter((app) => {
      const appDate = startOfDay(app.startTime);
      const selectedDateStart = startOfDay(selectedDate);
      return (
        isSameDay(appDate, selectedDateStart) &&
        app.staffId === staffId &&
        app.startTime.getHours() === hour
      );
    });
  };

  const getService = (serviceId: string) => {
    return SERVICES.find((s) => s.id === serviceId);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="text-center">
            <h3 className="text-2xl font-black text-slate-900">
              {format(selectedDate, 'EEEE', { locale: de })}
            </h3>
            <p className="text-slate-500 text-sm">
              {format(selectedDate, 'd. MMMM yyyy', { locale: de })}
            </p>
          </div>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
        >
          Heute
        </button>
      </div>

      {/* Staff Columns */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `80px repeat(${staff.length}, 1fr)` }}>
        {/* Header */}
        <div className="sticky top-0 bg-white z-10" />
        {staff.map((member) => (
          <div
            key={member.id}
            className="sticky top-0 bg-white z-10 flex items-center gap-3 p-4 rounded-xl border border-slate-100"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">{member.name}</p>
              <p className="text-xs text-slate-400">{member.role}</p>
            </div>
          </div>
        ))}

        {/* Time Slots */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="flex items-start justify-end pr-4 pt-2">
              <span className="text-xs font-bold text-slate-400">{hour}:00</span>
            </div>
            {staff.map((member) => {
              const slotAppointments = getAppointmentsForSlot(member.id, hour);
              return (
                <div
                  key={`${member.id}-${hour}`}
                  onClick={() => slotAppointments.length === 0 && onSlotClick(member.id, hour)}
                  className={`min-h-[80px] rounded-xl border transition-all ${
                    slotAppointments.length > 0
                      ? 'border-transparent'
                      : 'border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer'
                  }`}
                >
                  {slotAppointments.map((app) => {
                    const service = getService(app.serviceId);
                    const isBlock = app.isBlock;
                    return (
                      <div
                        key={app.id}
                        className={`h-full p-3 rounded-xl border ${
                          isBlock
                            ? 'bg-slate-100 border-slate-200'
                            : member.color
                        } group relative`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-sm">
                              {isBlock ? app.customerName : app.customerName}
                            </p>
                            {!isBlock && service && (
                              <p className="text-xs opacity-70">
                                {service.name} • {service.duration}min
                              </p>
                            )}
                            <span
                              className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                app.status === AppointmentStatus.CONFIRMED
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : app.status === AppointmentStatus.PENDING
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateAppointment(app);
                              }}
                              className="p-1.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Edit3 className="w-3 h-3 text-slate-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAppointment(app.id);
                              }}
                              className="p-1.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Trash2 className="w-3 h-3 text-rose-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
