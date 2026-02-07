import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Building2, MapPin, Clock, Users, Check } from 'lucide-react';

interface SalonRegistrationProps {
  onComplete: () => void;
  onCancel: () => void;
}

const SalonRegistration: React.FC<SalonRegistrationProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    salonName: '',
    category: '',
    location: '',
    address: '',
    openTime: '09:00',
    closeTime: '20:00',
    staffCount: '1-3',
  });

  const totalSteps = 4;

  const categories = ['Haare', 'Nägel', 'Kosmetik', 'Wellness', 'Barbershop'];
  const staffOptions = ['1-3', '4-6', '7-10', '10+'];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Salon Details</h3>
              <p className="text-slate-500 text-sm mt-1">Erzähl uns von deinem Salon</p>
            </div>
            <div>
              <label className="zen-label mb-2 block">Salonname</label>
              <input
                type="text"
                className="zen-input"
                placeholder="z.B. Beauty Studio Anna"
                value={formData.salonName}
                onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
              />
            </div>
            <div>
              <label className="zen-label mb-2 block">Kategorie</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                      formData.category === cat
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Standort</h3>
              <p className="text-slate-500 text-sm mt-1">Wo befindet sich dein Salon?</p>
            </div>
            <div>
              <label className="zen-label mb-2 block">Stadt</label>
              <input
                type="text"
                className="zen-input"
                placeholder="z.B. Berlin"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="zen-label mb-2 block">Adresse</label>
              <input
                type="text"
                className="zen-input"
                placeholder="z.B. Musterstraße 123"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Öffnungszeiten</h3>
              <p className="text-slate-500 text-sm mt-1">Wann ist dein Salon geöffnet?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="zen-label mb-2 block">Öffnet um</label>
                <input
                  type="time"
                  className="zen-input"
                  value={formData.openTime}
                  onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                />
              </div>
              <div>
                <label className="zen-label mb-2 block">Schließt um</label>
                <input
                  type="time"
                  className="zen-input"
                  value={formData.closeTime}
                  onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Team</h3>
              <p className="text-slate-500 text-sm mt-1">Wie groß ist dein Team?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {staffOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData({ ...formData, staffCount: option })}
                  className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                    formData.staffCount === option
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  {option} Mitarbeiter
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="floating-3d rounded-[2.5rem] p-10 max-w-lg w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                idx < step ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex gap-4 mt-10">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="zen-button-secondary flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </button>
          ) : (
            <button onClick={onCancel} className="zen-button-secondary">
              Abbrechen
            </button>
          )}
          <button onClick={handleNext} className="flex-1 zen-button-primary flex items-center justify-center gap-2">
            {step === totalSteps ? (
              <>
                <Check className="w-4 h-4" />
                Fertig
              </>
            ) : (
              <>
                Weiter
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonRegistration;
