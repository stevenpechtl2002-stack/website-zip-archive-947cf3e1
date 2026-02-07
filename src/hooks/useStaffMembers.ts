import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface StaffMember {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useStaffMembers() {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStaffMembers = useCallback(async () => {
    if (!user) {
      setStaffMembers([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('staff_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setStaffMembers((data as StaffMember[]) || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  const createStaffMember = useCallback(async (
    data: Pick<StaffMember, 'name' | 'color'> & Partial<Pick<StaffMember, 'avatar_url' | 'is_active' | 'sort_order'>>
  ) => {
    if (!user) throw new Error('Not authenticated');

    const { data: newStaff, error } = await supabase
      .from('staff_members')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    await fetchStaffMembers();
    return newStaff as StaffMember;
  }, [user, fetchStaffMembers]);

  const updateStaffMember = useCallback(async (
    id: string,
    data: Partial<Pick<StaffMember, 'name' | 'avatar_url' | 'color' | 'is_active' | 'sort_order'>>
  ) => {
    const { data: updated, error } = await supabase
      .from('staff_members')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchStaffMembers();
    return updated as StaffMember;
  }, [fetchStaffMembers]);

  const deleteStaffMember = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('staff_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchStaffMembers();
  }, [fetchStaffMembers]);

  return {
    staffMembers,
    activeStaffMembers: staffMembers.filter(s => s.is_active),
    loading,
    error,
    refetch: fetchStaffMembers,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
  };
}
