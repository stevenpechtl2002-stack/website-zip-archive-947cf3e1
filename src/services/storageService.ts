import { Appointment, Staff, Service, Customer, AppointmentStatus } from '@/types';
import { SERVICES, STAFF, INITIAL_APPOINTMENTS, CUSTOMERS } from '@/constants';

const STORAGE_KEYS = {
  appointments: 'zenbook_db_appointments',
  staff: 'zenbook_db_staff',
  services: 'zenbook_db_services',
  customers: 'zenbook_db_customers',
};

const parseStoredAppointments = (data: string): Appointment[] => {
  try {
    const parsed = JSON.parse(data);
    return parsed.map((app: any) => ({
      ...app,
      startTime: new Date(app.startTime),
      status: app.status as AppointmentStatus,
    }));
  } catch {
    return [];
  }
};

const parseStoredCustomers = (data: string): Customer[] => {
  try {
    const parsed = JSON.parse(data);
    return parsed.map((customer: any) => ({
      ...customer,
      lastVisit: customer.lastVisit ? new Date(customer.lastVisit) : undefined,
    }));
  } catch {
    return [];
  }
};

export const storageService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.appointments)) {
      localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.staff)) {
      localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(STAFF));
    }
    if (!localStorage.getItem(STORAGE_KEYS.services)) {
      localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.customers)) {
      localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(CUSTOMERS));
    }
  },

  getAppointments: (): Appointment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.appointments);
    return data ? parseStoredAppointments(data) : INITIAL_APPOINTMENTS;
  },

  saveAppointment: (appointment: Appointment) => {
    const appointments = storageService.getAppointments();
    const existingIndex = appointments.findIndex((a) => a.id === appointment.id);
    if (existingIndex >= 0) {
      appointments[existingIndex] = appointment;
    } else {
      appointments.push(appointment);
    }
    localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  },

  deleteAppointment: (id: string) => {
    const appointments = storageService.getAppointments().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
  },

  getStaff: (): Staff[] => {
    const data = localStorage.getItem(STORAGE_KEYS.staff);
    return data ? JSON.parse(data) : STAFF;
  },

  saveStaff: (staff: Staff) => {
    const staffList = storageService.getStaff();
    const existingIndex = staffList.findIndex((s) => s.id === staff.id);
    if (existingIndex >= 0) {
      staffList[existingIndex] = staff;
    } else {
      staffList.push(staff);
    }
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staffList));
  },

  getServices: (): Service[] => {
    const data = localStorage.getItem(STORAGE_KEYS.services);
    return data ? JSON.parse(data) : SERVICES;
  },

  saveService: (service: Service) => {
    const services = storageService.getServices();
    const existingIndex = services.findIndex((s) => s.id === service.id);
    if (existingIndex >= 0) {
      services[existingIndex] = service;
    } else {
      services.push(service);
    }
    localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
  },

  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.customers);
    return data ? parseStoredCustomers(data) : CUSTOMERS;
  },

  saveCustomer: (customer: Customer) => {
    const customers = storageService.getCustomers();
    const existingIndex = customers.findIndex((c) => c.id === customer.id);
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
  },

  deleteCustomer: (id: string) => {
    const customers = storageService.getCustomers().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};
