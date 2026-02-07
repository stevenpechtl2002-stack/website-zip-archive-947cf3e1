import React, { useState } from 'react';
import { Bell, Globe, Clock, Shield, Zap, Send } from 'lucide-react';

interface SettingsProps {
  onSimulateIncoming: (payload: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSimulateIncoming }) => {
  const [webhookPayload, setWebhookPayload] = useState({
    customerName: 'Max Mustermann',
    serviceName: 'Haarschnitt',
    staffName: 'Sarah',
    startTime: new Date().toISOString(),
  });

  const handleSimulate = () => {
    onSimulateIncoming(webhookPayload);
  };

  const settingSections = [
    {
      title: 'Benachrichtigungen',
      icon: <Bell className="w-5 h-5" />,
      settings: [
        { label: 'E-Mail bei neuer Buchung', enabled: true },
        { label: 'Push-Benachrichtigungen', enabled: true },
        { label: 'SMS-Erinnerungen', enabled: false },
      ],
    },
    {
      title: 'Geschäftszeiten',
      icon: <Clock className="w-5 h-5" />,
      settings: [
        { label: 'Montag - Freitag: 09:00 - 20:00', enabled: true },
        { label: 'Samstag: 10:00 - 16:00', enabled: true },
        { label: 'Sonntag: Geschlossen', enabled: false },
      ],
    },
    {
      title: 'Sprache & Region',
      icon: <Globe className="w-5 h-5" />,
      settings: [
        { label: 'Deutsch (Deutschland)', enabled: true },
        { label: 'EUR als Währung', enabled: true },
      ],
    },
    {
      title: 'Sicherheit',
      icon: <Shield className="w-5 h-5" />,
      settings: [
        { label: 'Zwei-Faktor-Authentifizierung', enabled: false },
        { label: 'Automatische Abmeldung nach 30 Min', enabled: true },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Einstellungen</h2>
        <p className="text-slate-500 text-sm mt-1">Verwalte deine Salon-Konfiguration</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section) => (
          <div key={section.title} className="zen-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">{section.icon}</div>
              <h3 className="font-bold text-slate-900">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.settings.map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{setting.label}</span>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      setting.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        setting.enabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* API Webhook Simulator */}
      <div className="zen-card border-2 border-dashed border-indigo-200 bg-indigo-50/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">API Webhook Simulator</h3>
            <p className="text-sm text-slate-500">Teste eingehende Buchungen über die API</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="zen-label mb-2 block">Kundenname</label>
            <input
              type="text"
              className="zen-input"
              value={webhookPayload.customerName}
              onChange={(e) => setWebhookPayload({ ...webhookPayload, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="zen-label mb-2 block">Service</label>
            <input
              type="text"
              className="zen-input"
              value={webhookPayload.serviceName}
              onChange={(e) => setWebhookPayload({ ...webhookPayload, serviceName: e.target.value })}
            />
          </div>
          <div>
            <label className="zen-label mb-2 block">Mitarbeiter</label>
            <input
              type="text"
              className="zen-input"
              value={webhookPayload.staffName}
              onChange={(e) => setWebhookPayload({ ...webhookPayload, staffName: e.target.value })}
            />
          </div>
          <div>
            <label className="zen-label mb-2 block">Datum/Uhrzeit</label>
            <input
              type="datetime-local"
              className="zen-input"
              value={webhookPayload.startTime.slice(0, 16)}
              onChange={(e) =>
                setWebhookPayload({ ...webhookPayload, startTime: new Date(e.target.value).toISOString() })
              }
            />
          </div>
        </div>

        <button onClick={handleSimulate} className="zen-button-primary flex items-center gap-2">
          <Send className="w-4 h-4" />
          Webhook simulieren
        </button>
      </div>
    </div>
  );
};

export default Settings;
