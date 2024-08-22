// Home: Typing test UI, score submission, scoreboard, and session display.
'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { randomPassage } from '@/lib/passages';

export default function Home() {
  const router = useRouter();
  // Scores & submission
  const [scores, setScores] = useState<{ name: string; wpm: number; accuracy?: number; passageId?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  // Removed legacy playerName in favor of auth username

  // Typing test state
  const [passage, setPassage] = useState(() => randomPassage());
  const [mode, setMode] = useState<'full' | 'timed'>('full');
  const [duration] = useState(60); // seconds for timed mode
  const [now, setNow] = useState(Date.now());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const testText = passage.text;
  const [userInput, setUserInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auth-state (fetched from cookie session)
  const [username, setUsername] = useState<string>('');
  const [tokenPresent, setTokenPresent] = useState(false);

  useEffect(() => {
    fetch('/api/scores').then(r => r.json()).then(d => { if (d.ok) setScores(d.scores); });
    fetch('/api/auth/me').then(r=> r.json()).then(d=> { if(d.ok && d.user){ setUsername(d.user.username); setTokenPresent(true);} });
  }, []);

  const totalChars = testText.length;
  const correctChars = [...userInput].filter((ch, i) => ch === testText[i]).length;
  const accuracy = userInput.length ? (correctChars / userInput.length) * 100 : 0;
  const elapsedMs = startedAt ? (endedAt ?? now) - startedAt : 0;
  const timeLeft = mode === 'timed' ? Math.max(0, duration - Math.floor(elapsedMs / 1000)) : null;
  const minutes = elapsedMs / 1000 / 60 || 1 / 60; // avoid div by zero early
  const grossWpm = (userInput.length / 5) / minutes;
  const finished = isFinished;

  useEffect(() => {
    if (mode === 'timed' && timeLeft === 0 && !finished && startedAt) {
      setIsFinished(true);
      setEndedAt(Date.now());
    }
  }, [timeLeft, mode, finished, startedAt]);

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(id); }, []);

  const handleChange = (v: string) => {
    if (!startedAt) { setStartedAt(Date.now()); setErrorMsg(null); }
    if (finished) return;
    if (mode === 'timed') {
      setUserInput(v);
    } else if (v.length <= testText.length) {
      setUserInput(v);
      if (v.length === testText.length) { setIsFinished(true); setEndedAt(Date.now()); }
    }
  };

  const reset = useCallback((newPassage?: boolean) => {
    setUserInput(''); setStartedAt(null); setEndedAt(null); setIsFinished(false); setErrorMsg(null);
    if (newPassage) { setPassage(p => randomPassage(p.id)); }
    inputRef.current?.focus();
  }, []);

  async function logout(){
    try { await fetch('/api/auth/logout', { method:'POST' }); } catch {}
    setUsername('');
    setTokenPresent(false);
    router.replace('/auth?next=/');
  }

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
  if (!isFinished || !tokenPresent) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
  const res = await fetch('/api/scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wpm: Math.round(grossWpm), accuracy: Math.round(accuracy), passageId: passage.id }) });
      const data = await res.json();
      if (data.ok) {
        const refreshed = await fetch('/api/scores').then(r => r.json()); if (refreshed.ok) setScores(refreshed.scores);
      } else { setErrorMsg(data.error || 'Submit failed'); }
  } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'Error'); } finally { setSubmitting(false); }
  };

  const renderTestText = () => {
    return (
      <p className="font-mono text-sm leading-6 select-none">
        {[...testText].map((ch, i) => {
          let cls = '';
          if (i < userInput.length) {
            cls = userInput[i] === ch ? 'text-green-400' : 'text-red-500';
          } else if (i === userInput.length && startedAt) {
            cls = 'underline text-blue-400';
          } else {
            cls = 'text-gray-500';
          }
          return <span key={i} className={cls}>{ch}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 font-sans flex flex-col items-center px-4 py-8 gap-10">
      <header className="w-full max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Typing Speed Test</h1>
        <div className="flex flex-wrap gap-4 text-sm items-center">
          <div><span className="text-gray-400">Mode:</span> {mode === 'timed' ? '60s Timed' : 'Full Passage'}</div>
          {mode === 'timed' && <div><span className="text-gray-400">Time:</span> {timeLeft}s</div>}
          <div><span className="text-gray-400">WPM:</span> {Math.round(grossWpm) || 0}</div>
          <div><span className="text-gray-400">Accuracy:</span> {Math.round(accuracy)}%</div>
          <div><span className="text-gray-400">Progress:</span> {userInput.length}/{totalChars}</div>
          {startedAt && !finished && <div className="animate-pulse text-blue-400">LIVE</div>}
          {finished && <div className="text-emerald-400">DONE</div>}
        </div>
      </header>
      <main className="w-full max-w-4xl grid md:grid-cols-2 gap-10">
        <section className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <h2 className="font-semibold text-lg">Test</h2>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setMode(m => m === 'full' ? 'timed' : 'full')} className="px-3 py-1 rounded bg-gray-800 border border-gray-600 hover:bg-gray-700">Switch to {mode === 'full' ? 'Timed' : 'Full'}</button>
              <button onClick={() => reset(true)} className="px-3 py-1 rounded bg-gray-800 border border-gray-600 hover:bg-gray-700">New Passage</button>
            </div>
          </div>
          <div className="text-xs text-gray-500">Passage: <span className="text-gray-300 font-mono">{passage.id}</span></div>
          <div className="rounded-lg border border-gray-700 p-4 bg-gray-900 shadow-inner min-h-[120px]">
            {renderTestText()}
          </div>
          <textarea
            ref={inputRef}
            className="w-full h-40 rounded-md bg-gray-950 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-3 font-mono text-sm resize-none tracking-wide"
            placeholder="Start typing here..."
            value={userInput}
            onChange={e => handleChange(e.target.value)}
            disabled={finished && mode === 'full'}
          />
          <div className="flex flex-wrap gap-3">
            <button onClick={() => reset()} className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm">Reset</button>
            <button onClick={() => reset(true)} className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm">Reset & New</button>
            {finished && <button onClick={() => { reset(); }} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium">Retry</button>}
          </div>
          {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
        </section>
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Submit Score</h2>
            {!finished && <p className="text-xs text-gray-500">Finish or timer end to unlock submission.</p>}
            <form onSubmit={submitScore} className="flex flex-col gap-3">
              <div className="flex gap-2 items-center text-xs">{tokenPresent? <span className="text-gray-400">User: {username}</span>: <span className="text-gray-500">Not authenticated</span>}</div>
              <div className="flex gap-4 text-sm">
                <div className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 text-center">
                  <div className="text-xs text-gray-400">WPM</div>
                  <div className="text-lg font-semibold">{Math.round(grossWpm) || 0}</div>
                </div>
                <div className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 text-center">
                  <div className="text-xs text-gray-400">Accuracy</div>
                  <div className="text-lg font-semibold">{Math.round(accuracy)}%</div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!finished || submitting || !tokenPresent}
                className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium"
              >{submitting ? 'Submitting…' : 'Save Score'}</button>
            </form>
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Top Scores</h2>
            <ul className="space-y-1 text-sm max-h-60 overflow-auto pr-1">
              {scores.map((s, i) => (
                <li key={i} className="flex justify-between rounded px-2 py-1 bg-gray-900 border border-gray-800">
                  <span className="truncate max-w-[45%]" title={s.name}>{s.name}</span>
                  <span className="tabular-nums">{s.wpm} wpm{s.accuracy ? ` (${s.accuracy}%)` : ''} • {s.passageId || '—'}</span>
                </li>
              ))}
              {!scores.length && <li className="text-gray-500">No scores yet.</li>}
            </ul>
          </div>
        </section>
        <section className="space-y-6 order-first md:order-none">
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Account</h2>
            {tokenPresent ? (
              <div className="text-xs flex items-center gap-2">
                <span className="text-gray-400">Logged in as {username}</span>
                <button onClick={logout} className="underline text-red-400">Logout</button>
              </div>
            ) : (
              <div className="text-xs text-gray-500">Session missing. <a href="/auth" className="underline text-blue-400">Login / Register</a></div>
            )}
          </div>
        </section>
      </main>
      <footer className="text-xs text-gray-600 pt-4">Built for practice. Passage length: {totalChars} chars.</footer>
    </div>
  );
}
