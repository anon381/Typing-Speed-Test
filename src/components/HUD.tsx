"use client";
import React from 'react';

export default function HUD({
  wpm,
  accuracy,
  progress,
  total,
  timeLeft,
  onSelectDuration,
  duration,
}: {
  wpm: number;
  accuracy: number;
  progress: number;
  total: number;
  timeLeft: number | null;
  onSelectDuration: (d: number) => void;
  duration: number;
}) {
  const pct = total ? Math.min(100, Math.round((progress / total) * 100)) : 0;
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-3 items-center">
          <div className="p-2 rounded bg-gray-900 border border-gray-700 text-center">
            <div className="text-xs text-gray-400">WPM</div>
            <div className="text-lg font-semibold tabular-nums">{Math.round(wpm) || 0}</div>
          </div>
          <div className="p-2 rounded bg-gray-900 border border-gray-700 text-center">
            <div className="text-xs text-gray-400">Accuracy</div>
            <div className="text-lg font-semibold">{Math.round(accuracy)}%</div>
          </div>
          <div className="text-sm text-gray-300">{progress}/{total}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">Time:</div>
          <div className="px-2 py-1 bg-gray-800 rounded text-sm font-medium">{timeLeft ?? duration}s</div>
        </div>
      </div>

      <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
        <div className="h-2 bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex gap-2 text-xs">
        {[15,30,60,120].map(d => (
          <button key={d} onClick={()=>onSelectDuration(d)} className={`px-3 py-1 rounded ${d===duration? 'bg-blue-600':'bg-gray-800'} text-sm`}>{d}s</button>
        ))}
      </div>
    </div>
  );
}
