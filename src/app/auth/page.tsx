"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

type AuthApiResponse = {
  ok: boolean;
  error?: string;
};

export default function AuthPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get('next') || '/';
  const [mode, setMode] = useState<'login'|'register'>('register');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRetype, setRegisterRetype] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(d=>{ if(d.ok && d.user){ router.replace(nextPath); } });
  }, [router, nextPath]);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    if(loading) return;
    setError(null); setSuccess(null); setLoading(true);
    const endpoint = mode==='register'? '/api/auth/register':'/api/auth/login';
    try {
      const payload = mode === 'register'
        ? { name: registerName, email: registerEmail, password: registerPassword, retype: registerRetype }
        : { email: loginEmail, password: loginPassword };
      const res = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      let data: AuthApiResponse = { ok:false, error:'Unexpected response' };
      try {
        const parsed: unknown = await res.json();
        if (parsed && typeof parsed === 'object' && 'ok' in parsed) {
          const candidate = parsed as { ok?: unknown; error?: unknown };
          data = {
            ok: candidate.ok === true,
            error: typeof candidate.error === 'string' ? candidate.error : undefined,
          };
        }
      } catch {
        /* ignore parse error */
      }
      if (!data.ok) { setError(data.error || 'Failed'); setLoading(false); return; }
      // Registration now auto-signs in via server cookie and redirects.
      if (mode === 'register') {
        setLoading(false);
        await new Promise(r => setTimeout(r, 40));
        try { router.replace(nextPath); } catch { window.location.href = nextPath; }
        return;
      }
      // Login — navigate after success
      setLoading(false);
      setLoginPassword('');
      await new Promise(r => setTimeout(r, 40));
      try { router.replace(nextPath); } catch { window.location.href = nextPath; }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden px-4 py-8 flex items-center justify-center" style={{ background: 'radial-gradient(1200px 700px at -10% 0%, rgba(37,99,235,0.22), transparent), radial-gradient(1000px 700px at 110% 100%, rgba(16,185,129,0.20), transparent), var(--bg)' }}>
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl float-blob" style={{ background: 'rgba(37,99,235,0.25)' }} />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full blur-3xl float-blob-rev" style={{ background: 'rgba(16,185,129,0.20)' }} />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ color: 'var(--text)' }}>Typing Speed Test</Link>
          <ThemeToggle />
        </div>

        <div className="rounded-2xl border p-6 shadow-xl backdrop-blur-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--panel) 92%, transparent)', borderColor: 'var(--panel-border)', color: 'var(--text)' }}>
          <div className="mb-5">
            <h1 className="text-2xl font-semibold">{mode === 'register' ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{mode === 'register' ? 'Join and track your typing progress.' : 'Sign in to save and compare your scores.'}</p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl p-1" style={{ backgroundColor: 'color-mix(in srgb, var(--panel) 75%, var(--bg) 25%)' }}>
            <button type="button" onClick={() => { setMode('login'); setError(null); setSuccess(null); }} className="rounded-lg px-3 py-2 text-sm font-medium transition" style={{ backgroundColor: mode === 'login' ? '#2563eb' : 'transparent', color: mode === 'login' ? '#fff' : 'var(--text)' }}>Sign In</button>
            <button type="button" onClick={() => { setMode('register'); setError(null); setSuccess(null); }} className="rounded-lg px-3 py-2 text-sm font-medium transition" style={{ backgroundColor: mode === 'register' ? '#2563eb' : 'transparent', color: mode === 'register' ? '#fff' : 'var(--text)' }}>Register</button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === 'register' && (
              <input autoFocus required value={registerName} onChange={e => setRegisterName(e.target.value)} placeholder="Full name" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--panel-border)' }} />
            )}
            {mode === 'register' ? (
              <input required value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--panel-border)' }} />
            ) : (
              <input autoFocus required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--panel-border)' }} />
            )}
            {mode === 'register' ? (
              <input required type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--panel-border)' }} />
            ) : (
              <input required type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--panel-border)' }} />
            )}
            {mode === 'register' && (
              <input required type="password" value={registerRetype} onChange={e => setRegisterRetype(e.target.value)} placeholder="Retype password" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--panel-border)' }} />
            )}

            {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
            {success && <p className="text-xs" style={{ color: '#22c55e' }}>{success}</p>}

            <button disabled={loading} className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(90deg, #2563eb, #1d4ed8)' }}>
              {loading ? 'Processing...' : mode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .float-blob { animation: floatA 8s ease-in-out infinite; }
        .float-blob-rev { animation: floatB 9s ease-in-out infinite; }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(12px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(16px) translateX(-10px); }
        }
      `}</style>
    </div>
  );
}
