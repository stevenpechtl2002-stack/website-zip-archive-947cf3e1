import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Key, 
  Building2, 
  Copy, 
  Check, 
  ExternalLink,
  Loader2,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SalonData {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  api_keys: {
    id: string;
    key_prefix: string;
    name: string | null;
    is_active: boolean;
    created_at: string;
    last_used_at: string | null;
  }[];
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function AdminDashboard() {
  const [salons, setSalons] = useState<SalonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSalons = async () => {
    setLoading(true);
    try {
      // Fetch all profiles (salon owners)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all API keys
      const { data: apiKeys, error: apiKeysError } = await supabase
        .from('api_keys')
        .select('id, user_id, key_prefix, name, is_active, created_at, last_used_at');

      if (apiKeysError) throw apiKeysError;

      // Combine data
      const salonData: SalonData[] = (profiles || []).map(profile => ({
        ...profile,
        api_keys: (apiKeys || []).filter(key => key.user_id === profile.id)
      }));

      setSalons(salonData);
    } catch (error: any) {
      console.error('Error fetching salons:', error);
      toast({
        title: 'Fehler',
        description: 'Konnte Salons nicht laden',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: 'Kopiert!',
      description: 'In die Zwischenablage kopiert'
    });
  };

  const getApiUrl = (endpoint: string) => {
    return `${SUPABASE_URL}/functions/v1/${endpoint}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Übersicht aller Salons und ihrer API-Zugänge
          </p>
        </div>
        <Button onClick={fetchSalons} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Aktualisieren
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{salons.length}</p>
              <p className="text-sm text-muted-foreground">Registrierte Salons</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {salons.reduce((acc, s) => acc + s.api_keys.filter(k => k.is_active).length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Aktive API Keys</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">4</p>
              <p className="text-sm text-muted-foreground">API Endpoints</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints Reference */}
      <div className="p-6 bg-card rounded-2xl border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-primary" />
          API Endpoints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'get-available-slots', desc: 'Verfügbare Termine abrufen' },
            { name: 'create-reservation', desc: 'Neue Reservierung erstellen' },
            { name: 'cancel-reservation', desc: 'Reservierung stornieren' },
            { name: 'generate-api-key', desc: 'Neuen API Key generieren' },
          ].map(endpoint => (
            <div key={endpoint.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div>
                <code className="text-sm font-mono text-primary">{endpoint.name}</code>
                <p className="text-xs text-muted-foreground">{endpoint.desc}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(getApiUrl(endpoint.name), endpoint.name)}
              >
                {copiedId === endpoint.name ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Salons List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Alle Salons ({salons.length})
        </h2>
        
        {salons.length === 0 ? (
          <div className="p-12 bg-card rounded-2xl border border-border text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Noch keine Salons registriert</p>
          </div>
        ) : (
          <div className="space-y-4">
            {salons.map(salon => (
              <div key={salon.id} className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Salon Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {(salon.full_name || salon.email || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">
                          {salon.full_name || 'Unbenannter Salon'}
                        </h3>
                        <p className="text-sm text-muted-foreground">{salon.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registriert: {new Date(salon.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>

                  {/* API Keys */}
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      API Keys ({salon.api_keys.length})
                    </p>
                    {salon.api_keys.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">Keine API Keys erstellt</p>
                    ) : (
                      <div className="space-y-2">
                        {salon.api_keys.map(key => (
                          <div 
                            key={key.id} 
                            className={`flex items-center justify-between p-3 rounded-xl ${
                              key.is_active ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Key className={`w-4 h-4 ${key.is_active ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                              <div>
                                <code className="text-sm font-mono">{key.key_prefix}...</code>
                                <p className="text-xs text-muted-foreground">{key.name || 'Voice Agent'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                key.is_active 
                                  ? 'bg-emerald-500/20 text-emerald-600' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {key.is_active ? 'Aktiv' : 'Inaktiv'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* API URL */}
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      API Base URL
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                      <code className="text-xs font-mono text-foreground truncate flex-1">
                        {SUPABASE_URL}/functions/v1/
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`${SUPABASE_URL}/functions/v1/`, `url-${salon.id}`)}
                      >
                        {copiedId === `url-${salon.id}` ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
