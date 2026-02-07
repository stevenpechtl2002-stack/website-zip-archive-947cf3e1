import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from './AuthProvider';

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-primary" />
      </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Registrierung erfolgreich!
        </h2>
        <p className="text-muted-foreground mb-6">
          Bitte überprüfe dein E-Mail-Postfach und bestätige deine E-Mail-Adresse.
        </p>
        {onSwitchToLogin && (
          <Button onClick={onSwitchToLogin} variant="outline">
            Zurück zum Login
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
          Konto erstellen
        </h1>
        <p className="text-muted-foreground">
          Starte jetzt mit ZenBook
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Vollständiger Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="E-Mail Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Passwort (min. 6 Zeichen)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-12"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 font-bold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registrieren...
            </>
          ) : (
            'Konto erstellen'
          )}
        </Button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Bereits ein Konto?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-semibold hover:underline"
            >
              Jetzt anmelden
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
