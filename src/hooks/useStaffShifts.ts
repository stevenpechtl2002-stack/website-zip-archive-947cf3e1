import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StaffShift {
  id: string;
  staff_member_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  is_working: boolean;
  created_at: string;
}

export function useStaffShifts(staffMemberId?: string) {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<StaffShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShifts = useCallback(async () => {
    if (!user) {
      setShifts([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('staff_shifts')
        .select('*')
        .order('day_of_week', { ascending: true });

      if (staffMemberId) {
        query = query.eq('staff_member_id', staffMemberId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setShifts((data as StaffShift[]) || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, staffMemberId]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const upsertShift = useCallback(async (
    staffMemberId: string,
    dayOfWeek: number,
    data: Pick<StaffShift, 'start_time' | 'end_time' | 'is_working'>
  ) => {
    const { data: upserted, error } = await supabase
      .from('staff_shifts')
      .upsert(
        {
          staff_member_id: staffMemberId,
          day_of_week: dayOfWeek,
          ...data,
        },
        { onConflict: 'staff_member_id,day_of_week' }
      )
      .select()
      .single();

    if (error) throw error;
    await fetchShifts();
    return upserted as StaffShift;
  }, [fetchShifts]);

  const deleteShift = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('staff_shifts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchShifts();
  }, [fetchShifts]);

  // Helper to get shifts by day
  const getShiftsByDay = useCallback((dayOfWeek: number) => {
    return shifts.filter(s => s.day_of_week === dayOfWeek && s.is_working);
  }, [shifts]);

  // Helper to check if a staff member works on a specific day
  const staffWorksOnDay = useCallback((staffMemberId: string, dayOfWeek: number) => {
    return shifts.some(
      s => s.staff_member_id === staffMemberId && s.day_of_week === dayOfWeek && s.is_working
    );
  }, [shifts]);

  return {
    shifts,
    loading,
    error,
    refetch: fetchShifts,
    upsertShift,
    deleteShift,
    getShiftsByDay,
    staffWorksOnDay,
  };
}
