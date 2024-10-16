"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get('next') || '/';
  const [mode, setMode] = useState<'login'|'register'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(d=>{ if(d.ok && d.user){ router.replace(nextPath); } });
  }, [router, nextPath]);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    if(loading) return;
    setError(null); setLoading(true);
    const endpoint = mode==='register'? '/api/auth/register':'/api/auth/login';
    try {
      const res = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ username, password }) });
      let data: any = { ok:false, error:'Unexpected response' };
      try { data = await res.json(); } catch { /* ignore parse error */ }
      if(!data.ok){ setError(data.error||'Failed'); setLoading(false); return; }
      // Allow cookie to flush
      setLoading(false);
      await new Promise(r=>setTimeout(r, 40));
      // Confirm session
      let confirmed = false;
      try { const me = await fetch('/api/auth/me', { cache:'no-store' }).then(r=>r.json()); confirmed = !!(me && me.ok && me.user); } catch {}
      try {
        router.replace(nextPath);
        // Hard reload fallback if still stuck on /auth
        setTimeout(()=> { if(window.location.pathname === '/auth'){ window.location.href = nextPath; } }, confirmed ? 250 : 400);
      } catch { window.location.href = nextPath; }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-gray-100 px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">{mode==='register'? 'Create Account':'Sign In'}</h1>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <input autoFocus required value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 rounded bg-gray-950 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded bg-gray-950 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button disabled={loading} className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-medium">{loading? 'Processing…' : (mode==='register'? 'Register':'Login')}</button>
        </form>
        <div className="text-xs text-center text-gray-400">
          {mode==='register'? (
            <button onClick={()=> setMode('login')} className="underline">Have an account? Sign in</button>
          ): (
            <button onClick={()=> setMode('register')} className="underline">Need an account? Register</button>
          )}
        </div>
      </div>
    </div>
  );
}
