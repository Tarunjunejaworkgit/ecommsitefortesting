'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { KeyRound, ShieldCheck, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const error = searchParams.get('error');
  const details = searchParams.get('details');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleMicrosoftLogin = () => {
    // Redirect to Entra login endpoint
    window.location.href = '/api/auth/login';
  };

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      const res = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push(data.redirect || '/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || 'Incorrect credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-stone-250 p-8 rounded shadow-lg space-y-6 text-xs text-stone-600 font-light">
      
      {/* Brand */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif text-stone-900 tracking-[0.2em] uppercase font-normal">
          Admin Control
        </h2>
        <div className="w-12 h-0.5 bg-accent mx-auto" />
        <p className="text-stone-400">Mokshay Storefront Management</p>
      </div>

      {/* Error banner */}
      {(error || localError) && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Authentication Warning</span>
          </div>
          <p className="text-[10px] leading-relaxed">
            {localError || decodeURIComponent(details || error || '')}
          </p>
        </div>
      )}

      {/* Primary: Microsoft Entra ID */}
      <div className="space-y-3">
        <button
          onClick={handleMicrosoftLogin}
          className="w-full h-12 bg-[#2f2f2f] hover:bg-stone-950 text-white font-semibold uppercase tracking-wider transition rounded flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4" /> Login with Entra ID
        </button>
        <p className="text-[10px] text-stone-400 text-center leading-relaxed">
          Uses single sign-on (SSO) secure workspace tokens from Microsoft Azure Directory.
        </p>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-stone-200"></div>
        <span className="flex-shrink mx-4 text-stone-400 uppercase tracking-widest text-[9px] font-semibold">OR</span>
        <div className="flex-grow border-t border-stone-200"></div>
      </div>

      {/* Secondary: Local Bypass */}
      <form onSubmit={handleLocalSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-stone-700 font-semibold uppercase tracking-wide">Developer Bypass Key</label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter bypass password (admin123)"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-300 p-3 pl-10 rounded text-sm focus:outline-none focus:border-primary font-normal"
            />
            <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold uppercase tracking-wider transition rounded flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> {loading ? 'Checking...' : 'Sign In Offline'}
        </button>
      </form>

      <div className="pt-2 text-center">
        <Link href="/" className="inline-flex items-center gap-1 text-stone-400 hover:text-primary transition font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Storefront Sanctuary
        </Link>
      </div>

    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-stone-400 text-sm">Loading workspace secure portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
