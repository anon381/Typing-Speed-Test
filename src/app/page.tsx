'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [scores, setScores] = useState<{name:string; wpm:number; accuracy?:number}[]>([]);
  const [form, setForm] = useState({ name: "", wpm: "", accuracy: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/scores').then(r=>r.json()).then(d=>{ if(d.ok) setScores(d.scores); });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, wpm: Number(form.wpm), accuracy: form.accuracy? Number(form.accuracy): undefined }) });
      const data = await res.json();
      if(data.ok){
        setForm({ name: '', wpm: '', accuracy: '' });
        const refreshed = await fetch('/api/scores').then(r=>r.json());
        if(refreshed.ok) setScores(refreshed.scores);
      } else {
        console.error(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      <div>
        <section className="mt-8 w-full max-w-md">
          <h2 className="font-semibold mb-2">Submit Score</h2>
          <form onSubmit={submit} className="flex flex-col gap-2">
            <input className="border rounded px-2 py-1" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
            <input className="border rounded px-2 py-1" placeholder="WPM" type="number" value={form.wpm} onChange={e=>setForm(f=>({...f,wpm:e.target.value}))} required />
            <input className="border rounded px-2 py-1" placeholder="Accuracy % (optional)" type="number" value={form.accuracy} onChange={e=>setForm(f=>({...f,accuracy:e.target.value}))} />
            <button disabled={loading} className="bg-foreground text-background rounded px-3 py-1 disabled:opacity-50">{loading? 'Saving...' : 'Save'}</button>
          </form>
        </section>
        <section className="mt-8 w-full max-w-md">
          <h2 className="font-semibold mb-2">Top Scores</h2>
          <ul className="space-y-1 text-sm">
            {scores.map((s,i)=> <li key={i} className="flex justify-between"><span>{s.name}</span><span>{s.wpm} wpm{s.accuracy? ` (${s.accuracy}%)`: ''}</span></li>)}
            {!scores.length && <li className="text-gray-500">No scores yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
