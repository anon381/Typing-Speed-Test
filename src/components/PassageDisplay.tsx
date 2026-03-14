"use client";
import React from 'react';

export default function PassageDisplay({ text, userInput, startedAt, inputFocused }: { text: string; userInput: string; startedAt: number | null; inputFocused?: boolean }) {
  const caretVisible = !!(startedAt && inputFocused);
  return (
    <p className="font-mono leading-[1.6] select-none break-words m-0">
      {[...text].map((ch, i) => {
        let cls = 'text-gray-500';
        if (i < userInput.length) cls = userInput[i] === ch ? 'text-emerald-400' : 'text-red-400';
        else cls = 'text-gray-400';
        if (i === userInput.length && caretVisible) {
          return (
            <React.Fragment key={i}>
              <span className="caret-inline" aria-hidden>|</span>
              <span className={cls}>{ch}</span>
            </React.Fragment>
          );
        }
        return <span key={i} className={cls}>{ch}</span>;
      })}
      {caretVisible && userInput.length >= text.length ? <span className="caret-inline" aria-hidden>|</span> : null}
    </p>
  );
}
