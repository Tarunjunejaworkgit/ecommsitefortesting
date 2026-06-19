'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, ShieldCheck, ShieldAlert, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import StorefrontLayout from '@/components/StorefrontLayout';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get('error');
  const details = searchParams.get('details');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEntraLogin = () => {
    // Redirect to Entra login endpoint with state=customer
    window.location.href = '/api/auth/login?state=customer';
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      const res = await fetch('/api/auth/customer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      router.push(data.redirect || '/profile');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-stone-200 p-8 rounded shadow-sm space-y-6 text-xs text-stone-600 font-light">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-accent text-[10px] tracking-widest uppercase font-semibold block">Mokshay Account</span>
        <h2 className="text-3xl font-serif text-stone-900 font-normal">
          Ritual Sign In
        </h2>
        <div className="w-10 h-0.5 bg-accent mx-auto" />
        <p className="text-stone-400">Track orders, manage shipping care, and explore event scheduler.</p>
      </div>

      {/* Error banner */}
      {(error || localError) && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Sign In Notice</span>
          </div>
          <p className="text-[10px] leading-relaxed">
            {localError || decodeURIComponent(details || error || '')}
          </p>
        </div>
      )}

      {/* Entra ID Button */}
      <div className="space-y-3">
        <button
          onClick={handleEntraLogin}
          className="w-full h-12 bg-primary hover:bg-stone-850 text-white font-semibold uppercase tracking-wider transition rounded flex items-center justify-center gap-2 cursor-pointer"
        >
          <Mail className="w-4 h-4" /> Sign In with Microsoft SSO
        </button>
        <p className="text-[10px] text-stone-400 text-center leading-relaxed">
          Access your workspace or customer account using Microsoft single sign-on credentials.
        </p>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-stone-200"></div>
        <span className="flex-shrink mx-4 text-stone-400 uppercase tracking-widest text-[9px] font-semibold">OR</span>
        <div className="flex-grow border-t border-stone-200"></div>
      </div>

      {/* Customer Email Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-stone-700 font-semibold uppercase tracking-wide">Enter Email Address</label>
          <div className="relative">
            <input
              type="email"
              placeholder="e.g. tarun@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-300 p-3 pl-10 rounded text-sm focus:outline-none focus:border-primary font-normal text-stone-800"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold uppercase tracking-wider transition rounded flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" /> {loading ? 'Logging in...' : 'Sign in Offline Sandbox'}
        </button>
      </form>

      <div className="pt-2 text-center">
        <Link href="/" className="inline-flex items-center gap-1 text-stone-400 hover:text-primary transition font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <StorefrontLayout>
      <div className="min-h-[70vh] bg-stone-50/50 flex items-center justify-center py-12 px-4">
        <Suspense fallback={<div className="text-stone-400 text-sm">Loading secure portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </StorefrontLayout>
  );
}
