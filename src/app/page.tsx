"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { randomPassage } from '@/lib/passages';
import ThemeToggle from '@/components/ThemeToggle';
import PassageDisplay from '@/components/PassageDisplay';
import ResultsModal from '@/components/ResultsModal';

export default function Home() {
  const router = useRouter();
  const [scores, setScores] = useState<{ name: string; wpm: number; accuracy?: number; errors?: number; finishSeconds?: number; score?: number; passageId?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Typing test state
  const [passage, setPassage] = useState(() => randomPassage('t30'));
  const [mode, setMode] = useState<'full' | 'timed'>('timed');
  const [duration, setDuration] = useState<number>(30);
  const [now, setNow] = useState(Date.now());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const testText = passage.text;
  const [userInput, setUserInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Auth-state
  const [username, setUsername] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [tokenPresent, setTokenPresent] = useState(false);

  useEffect(() => {
    fetch('/api/scores').then(r => r.json()).then(d => { if (d.ok) setScores(d.scores); });
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.ok && d.user) {
        setUsername(d.user.name || d.user.email || 'User');
        setUserEmail(d.user.email || '');
        setTokenPresent(true);
      }
    });
  }, []);

  const totalChars = testText.length;
  const correctChars = [...userInput].filter((ch, i) => ch === testText[i]).length;
  const errors = [...userInput].filter((ch, i) => ch !== testText[i]).length;
  const accuracy = userInput.length ? (correctChars / userInput.length) * 100 : 0;
  const elapsedMs = startedAt ? (endedAt ?? now) - startedAt : 0;
  const timeLeft = mode === 'timed' ? Math.max(0, duration - Math.floor(elapsedMs / 1000)) : null;
  const minutes = elapsedMs / 1000 / 60 || 1 / 60;
  const effectiveWpm = (correctChars / 5) / minutes;

  useEffect(() => {
    if (mode === 'timed' && timeLeft === 0 && !isFinished && startedAt) {
      setIsFinished(true);
      setEndedAt(Date.now());
    }
  }, [timeLeft, mode, isFinished, startedAt]);

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(id); }, []);
  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => { if (isFinished) setModalOpen(true); }, [isFinished]);

  useEffect(() => {
    if (modalOpen && startedAt && !endedAt) {
      setEndedAt(Date.now());
    }
  }, [modalOpen, startedAt, endedAt]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!profileRef.current) return;
      const target = e.target as Node;
      if (!profileRef.current.contains(target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // keyboard shortcut: press T to focus typing input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        const active = document.activeElement as HTMLElement | null;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleChange = (v: string) => {
    if (!startedAt) { setStartedAt(Date.now()); setErrorMsg(null); }
    if (isFinished) return;
    // Always clamp input to passage length to avoid advancing past text
    const clamped = v.slice(0, testText.length);
    setUserInput(clamped);
    if (clamped.length === testText.length) { setIsFinished(true); setEndedAt(Date.now()); }
  };

  const reset = useCallback((newPassage?: boolean) => {
    setUserInput(''); setStartedAt(null); setEndedAt(null); setIsFinished(false); setErrorMsg(null);
    if (newPassage) {
      // choose based on current mode/duration
      if (mode === 'full') setPassage(randomPassage('full', passage.id));
      else {
        const cat = duration === 15 ? 't15' : duration === 30 ? 't30' : duration === 60 ? 't60' : 't120';
        setPassage(randomPassage(cat, passage.id));
      }
    }
    inputRef.current?.focus();
  }, [mode, duration, passage.id]);

  async function logout() {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    setUsername(''); setUserEmail(''); setTokenPresent(false); setProfileOpen(false); router.replace('/auth?next=/');
  }

  const saveScore = async () => {
    if (!isFinished || !tokenPresent) return;
    setSubmitting(true); setErrorMsg(null);
    try {
      const finishSeconds = Math.max(1, Math.round(elapsedMs / 1000));
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wpm: Math.round(effectiveWpm),
          accuracy: Math.round(accuracy),
          errors,
          finishSeconds,
          passageId: passage.id,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        const refreshed = await fetch('/api/scores').then(r => r.json()); if (refreshed.ok) setScores(refreshed.scores);
      } else {
        setErrorMsg(data.error || 'Submit failed');
      }
    } catch (err: unknown) { setErrorMsg(err instanceof Error ? err.message : 'Error'); } finally { setSubmitting(false); }
  };

  const submitOrRedirect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenPresent) { router.push('/auth?next=/'); return; }
    await saveScore();
  };
  const onSelectDuration = (d: number) => {
    setDuration(d);
    setMode('timed');
    const cat = d === 15 ? 't15' : d === 30 ? 't30' : d === 60 ? 't60' : 't120';
    setPassage(randomPassage(cat));
    // clear input
    setUserInput(''); setStartedAt(null); setEndedAt(null); setIsFinished(false);
    inputRef.current?.focus();
  };

  const pctElapsed = mode === 'timed' && startedAt ? Math.min(1, (elapsedMs / 1000) / duration) : 0;
  const circleDeg = Math.round(pctElapsed * 360);
  const hue = Math.round(120 - pctElapsed * 120);
  const timerAnimating = mode === 'timed' && !!startedAt && !isFinished && !modalOpen;

  return (
    <div className="min-h-screen w-full app-root font-sans flex flex-col items-center px-4 py-8">
      <header className="w-full flex items-center justify-between px-0">
        <div className="flex items-center gap-3 pl-3">
          <Link href="/" className="text-2xl font-bold">TurboType</Link>
        </div>
        <div className="flex items-center gap-3 pr-3">
          <ThemeToggle />
          {tokenPresent ? (
            <div className="profile-wrap" ref={profileRef}>
              <button className="profile-icon" onClick={() => setProfileOpen(v => !v)} aria-label="Open profile menu" type="button">{(username?.trim()?.[0] || 'U').toUpperCase()}</button>
              {profileOpen ? (
                <div className="profile-menu panel panel-border">
                  <div className="profile-name">{username}</div>
                  <div className="profile-email">{userEmail}</div>
                  <button onClick={logout} className="logout-btn">Logout</button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/auth" className="nav-auth-btn text-sm">Login / Register</Link>
          )}
        </div>
      </header>

      {/* Mode controls above stats */}
      <div className="w-full max-w-[900px] mx-auto mt-6 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 timed-picker">
            <label className="text-sm timed-label">Timed</label>
            <div className="timed-select-shell">
              <select
                value={mode==='timed' ? String(duration) : ''}
                onChange={e => onSelectDuration(Number(e.target.value))}
                className="timed-select"
              >
                <option value="">—</option>
                <option value="15">15s</option>
                <option value="30">30s</option>
                <option value="60">60s</option>
                <option value="120">120s</option>
              </select>
            </div>
          </div>
          <button onClick={() => { setMode('full'); setDuration(0); setPassage(randomPassage('full', passage.id)); }} className={`btn ${mode==='full' ? 'active' : ''}`}>Full Test</button>
        </div>
      </div>

      {/* Stats (moved above typing area) */}
      <div className="w-full max-w-[900px] mx-auto flex justify-center mt-6">
        <div className="w-full max-w-[700px] flex items-center justify-between gap-4">
          <div className="flex-1 p-3 panel panel-border text-center rounded">
            <div className="text-xs text-gray-400">WPM</div>
            <div className="text-xl font-semibold tabular-nums">{Math.round(effectiveWpm) || 0}</div>
          </div>
          <div className="flex-1 p-3 panel panel-border text-center rounded">
            <div className="text-xs text-gray-400">Accuracy</div>
            <div className="text-xl font-semibold">{Math.round(accuracy)}%</div>
          </div>
          <div className="flex-1 p-3 panel panel-border text-center rounded">
            <div className="text-xs text-gray-400">Progress</div>
            <div className="text-xl font-semibold">{userInput.length}/{totalChars}</div>
          </div>
          <div className="flex-1 text-center flex flex-col items-center justify-center">
            <div className="text-xs text-gray-400 mb-2">Time</div>
            <div className="circular-timer" style={{ background: `conic-gradient(hsl(${hue} 80% 45%) ${circleDeg}deg, rgba(0,0,0,0.08) ${circleDeg}deg)`, animation: timerAnimating ? 'timerPulse 1.4s ease-in-out infinite' : 'none' }}>
              <div className="inner">{mode === 'full' ? '--' : `${timeLeft ?? duration}s`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Passage + Input (interactive group) */}
      <div className="w-full flex justify-center mt-4 interactive-area">
        <div className="merged-card w-full">
          <div className="passage-area">
            <button onClick={() => reset(true)} className="new-text-overlay">New Text</button>
            <PassageDisplay text={testText} userInput={userInput} startedAt={startedAt} inputFocused={inputFocused} />
             <textarea
              ref={inputRef}
              rows={6}
              // placeholder intentionally removed for small screens to avoid overlap
              value={userInput}
              onChange={e => handleChange(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
              disabled={isFinished && mode === 'full'}
              aria-label="Typing input overlay"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-[900px] mx-auto flex justify-center mt-4">
        <div className="flex gap-4">
          <button onClick={() => reset()} className="btn">Reset</button>
          <button onClick={() => reset(true)} className="btn">Reset & New</button>
          <button onClick={() => { void submitOrRedirect(); }} disabled={!isFinished || submitting} className="btn" style={{ backgroundColor: 'rgb(16 185 129)', color: 'white' }}>{submitting ? 'Submitting…' : 'Submit Score'}</button>
        </div>
      </div>
      {errorMsg && <p className="mt-2 text-sm" style={{ color: '#ef4444' }}>{errorMsg}</p>}

      {/* Scores / Account */}
      <div className="w-full max-w-[900px] mx-auto flex flex-col items-center mt-10">
          <div className="w-full max-w-[600px] text-center">
          <h3 className="font-semibold text-lg">Top 7 scorers</h3>
          {scores.length ? (
            <div className="mt-3 panel panel-border rounded overflow-x-auto">
              <table className="score-table w-full text-sm">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>WPM</th>
                    <th>Name</th>
                    <th>Accuracy</th>
                    <th>Errors</th>
                    <th>Finish</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.slice(0, 7).map((s, i) => (
                    <tr key={i}>
                      <td>#{i + 1}</td>
                      <td className="tabular-nums">{s.wpm} wpm</td>
                      <td>{s.name}</td>
                      <td>{typeof s.accuracy === 'number' ? `${s.accuracy}%` : '--'}</td>
                      <td>{typeof s.errors === 'number' ? s.errors : '--'}</td>
                      <td>{typeof s.finishSeconds === 'number' ? `${s.finishSeconds}s` : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="mt-3 text-gray-500 text-sm">No scores yet</div>}

        </div>
      </div>

      <ResultsModal open={modalOpen} onClose={() => setModalOpen(false)} wpm={effectiveWpm} accuracy={accuracy} errors={errors} onSave={submitOrRedirect} />
    </div>
  );
}
