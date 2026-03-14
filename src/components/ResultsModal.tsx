"use client";
import React, { useState } from 'react';

export default function ResultsModal({ open, onClose, wpm, accuracy, errors, onSave } : {
  open: boolean;
  onClose: () => void;
  wpm: number;
  accuracy: number;
  errors: number;
  onSave: () => Promise<void>;
}){
  const [saving, setSaving] = useState(false);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <div className="mt-4 space-y-2 text-sm">
          <div><strong>WPM:</strong> {Math.round(wpm)}</div>
          <div><strong>Accuracy:</strong> {Math.round(accuracy)}%</div>
          <div><strong>Errors:</strong> {errors}</div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800">Close</button>
          <button
            onClick={async ()=>{ setSaving(true); try{ await onSave(); } finally { setSaving(false); onClose(); } }}
            disabled={saving}
            className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-50"
          >{saving? 'Saving…' : 'Save Score'}</button>
        </div>
      </div>
    </div>
  );
}
