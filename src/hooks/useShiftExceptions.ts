import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ShiftException {
  id: string;
  staff_member_id: string;
  exception_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
}

export function useShiftExceptions() {
  const { user } = useAuth();
  const [exceptions, setExceptions] = useState<ShiftException[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExceptions = useCallback(async () => {
    if (!user) { setExceptions([]); setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('shift_exceptions')
        .select('*')
        .order('exception_date', { ascending: true });
      if (error) throw error;
      setExceptions((data as ShiftException[]) || []);
    } catch (err) {
      console.error('Error fetching shift exceptions:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchExceptions(); }, [fetchExceptions]);

  const createException = useCallback(async (data: {
    staff_member_id: string;
    exception_date: string;
    start_time?: string | null;
    end_time?: string | null;
    reason?: string | null;
  }) => {
    const { data: created, error } = await supabase
      .from('shift_exceptions')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    await fetchExceptions();
    return created as ShiftException;
  }, [fetchExceptions]);

  const deleteException = useCallback(async (id: string) => {
    const { error } = await supabase.from('shift_exceptions').delete().eq('id', id);
    if (error) throw error;
    await fetchExceptions();
  }, [fetchExceptions]);

  const getExceptionsForStaffAndDate = useCallback((staffId: string, date: string) => {
    return exceptions.filter(e => e.staff_member_id === staffId && e.exception_date === date);
  }, [exceptions]);

  const hasExceptionAt = useCallback((staffId: string, date: string, hour: number, minutes: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    return exceptions.some(e => {
      if (e.staff_member_id !== staffId || e.exception_date !== date) return false;
      if (!e.start_time || !e.end_time) return true; // full day exception
      return timeStr >= e.start_time && timeStr < e.end_time;
    });
  }, [exceptions]);

  return {
    exceptions, loading, refetch: fetchExceptions,
    createException, deleteException,
    getExceptionsForStaffAndDate, hasExceptionAt,
  };
}
