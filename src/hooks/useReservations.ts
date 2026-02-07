import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Reservation {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  date: string;
  time: string;
  end_time: string | null;
  staff_member_id: string | null;
  product_id: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  source: 'voice_agent' | 'manual' | 'website' | 'phone' | 'n8n';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useReservations(dateFilter?: string) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReservations = useCallback(async () => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (dateFilter) {
        query = query.eq('date', dateFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setReservations((data as Reservation[]) || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, dateFilter]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchReservations]);

  const createReservation = useCallback(async (
    data: Omit<Reservation, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!user) throw new Error('Not authenticated');

    const { data: newReservation, error } = await supabase
      .from('reservations')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return newReservation as Reservation;
  }, [user]);

  const updateReservation = useCallback(async (
    id: string,
    data: Partial<Omit<Reservation, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    const { data: updated, error } = await supabase
      .from('reservations')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated as Reservation;
  }, []);

  const deleteReservation = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }, []);

  const cancelReservation = useCallback(async (id: string) => {
    return updateReservation(id, { status: 'cancelled' });
  }, [updateReservation]);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    cancelReservation,
  };
}
