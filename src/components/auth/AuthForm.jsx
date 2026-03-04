import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui-login/input';
import { Label } from '@/components/ui-login/label';

export default function AuthForm({ onSubmit, loading, error, submitLabel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFilled = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-neutral-800">
          Email
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
            <Mail size={18} />
          </span>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 rounded-xl border border-[#C3110C] focus-visible:ring-2 focus-visible:ring-[#E6501B] focus-visible:border-[#E6501B] focus-visible:ring-offset-1"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-neutral-800">
          Password
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
            <Lock size={18} />
          </span>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 rounded-xl border border-[#C3110C] focus-visible:ring-2 focus-visible:ring-[#E6501B] focus-visible:border-[#E6501B] focus-visible:ring-offset-1"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: isFilled ? '#C3110C' : '#d1d5db', cursor: isFilled ? 'pointer' : 'default' }}
        onMouseEnter={e => { if (isFilled) e.currentTarget.style.backgroundColor = '#E6501B'; }}
        onMouseLeave={e => { if (isFilled) e.currentTarget.style.backgroundColor = '#C3110C'; }}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-white text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{submitLabel}</span>
      </button>
    </form>
  );
}


