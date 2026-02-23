import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OpeningHours {
  [dayIndex: string]: { open: string; close: string; closed: boolean };
}

const DEFAULT_HOURS: OpeningHours = {
  '0': { open: '09:00', close: '18:00', closed: true },
  '1': { open: '09:00', close: '18:00', closed: false },
  '2': { open: '09:00', close: '18:00', closed: false },
  '3': { open: '09:00', close: '18:00', closed: false },
  '4': { open: '09:00', close: '18:00', closed: false },
  '5': { open: '09:00', close: '14:00', closed: false },
  '6': { open: '09:00', close: '14:00', closed: true },
};

export interface VoiceAgentConfig {
  id: string;
  user_id: string;
  business_name: string | null;
  industry: string | null;
  opening_hours: OpeningHours;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useBusinessSettings() {
  const { user } = useAuth();
  const [config, setConfig] = useState<VoiceAgentConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    if (!user) { setConfig(null); setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('voice_agent_config' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        const d = data as any;
        setConfig({ ...d, opening_hours: (d.opening_hours && Object.keys(d.opening_hours).length > 0) ? d.opening_hours : DEFAULT_HOURS });
      } else {
        setConfig(null);
      }
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const saveConfig = useCallback(async (updates: Partial<Pick<VoiceAgentConfig, 'business_name' | 'industry' | 'opening_hours' | 'is_active'>>) => {
    if (!user) throw new Error('Not authenticated');
    if (config) {
      const { error } = await supabase.from('voice_agent_config' as any).update(updates as any).eq('id', config.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('voice_agent_config' as any).insert({ user_id: user.id, ...updates } as any);
      if (error) throw error;
    }
    await fetchConfig();
  }, [user, config, fetchConfig]);

  const isDayClosed = useCallback((dayIndex: number): boolean => {
    const hours = config?.opening_hours || DEFAULT_HOURS;
    return hours[String(dayIndex)]?.closed ?? true;
  }, [config]);

  return { config, loading, saveConfig, isDayClosed, DEFAULT_HOURS };
}
