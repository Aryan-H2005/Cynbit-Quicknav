import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CornerDownLeft, ExternalLink, Search, X } from 'lucide-react';
import Kbd from './Kbd.jsx';
import { searchDestinations } from '../lib/search.js';

function Highlight({ text, query }) {
  const words = query.trim().split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (words.length === 0) return text;
  const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-brand-100 px-0.5 text-inherit dark:bg-brand-500/30">{part}</mark>
    ) : (
      part
    ),
  );
}

export default function CommandPalette({ open, onClose, destinations, onNavigate }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const titleId = `${uid}-title`;

  const results = useMemo(() => searchDestinations(destinations, query), [destinations, query]);

  // On open: reset, focus the input, lock page scroll. On close: give focus back.
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    setQuery('');
    setActive(0);
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [active, results]);

  if (!open) return null;

  const choose = (destination) => {
    if (!destination) return;
    onClose();
    onNavigate(destination);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length === 0) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + step + results.length) % results.length);
    } else if (e.key === 'Enter' && e.target === inputRef.current && !e.nativeEvent.isComposing) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      // Keep focus inside the dialog: only the input and the close button are focusable.
      const focusable = dialogRef.current.querySelectorAll('input, button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const showGroups = query.trim() === '';

  return (
    <div
      className="qn-overlay fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-3 pt-[8vh] backdrop-blur-sm sm:pt-[14vh]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="qn-dialog w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 id={titleId} className="sr-only">Search Cynbit pages</h2>

        <div className="flex items-center gap-3 border-b border-slate-200 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 dark:border-slate-700">
          <Search size={18} aria-hidden="true" className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="Search Cynbit pages"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? `${uid}-opt-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck="false"
            placeholder="Search pages, products, topics..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            className="h-14 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 dark:hover:bg-slate-800"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <ul ref={listRef} id={listId} role="listbox" aria-label="Matching pages" className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li role="presentation" className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              <p className="font-medium text-slate-700 dark:text-slate-200">No pages match “{query}”.</p>
              <p className="mt-1">Try a shorter word, like “services”, “jobs” or “contact”.</p>
            </li>
          ) : (
            results.map((item, i) => (
              <li key={item.id} role="presentation">
                {showGroups && item.category !== results[i - 1]?.category && (
                  <p className="px-3 pb-1 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{item.category}</p>
                )}
                <div
                  id={`${uid}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => i !== active && setActive(i)}
                  onClick={() => choose(item)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${i === active ? 'bg-brand-50 dark:bg-brand-500/15' : ''}`}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium"><Highlight text={item.title} query={query} /></div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400"><Highlight text={item.description} query={query} /></div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {!showGroups && <span>{item.category}</span>}
                    <ExternalLink size={14} aria-hidden="true" />
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <p role="status" className="sr-only">{results.length} {results.length === 1 ? 'result' : 'results'}</p>

        <div className="hidden items-center gap-4 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:flex">
          <span className="flex items-center gap-1.5"><Kbd><ArrowUp size={11} aria-label="Up" /></Kbd><Kbd><ArrowDown size={11} aria-label="Down" /></Kbd> Navigate</span>
          <span className="flex items-center gap-1.5"><Kbd><CornerDownLeft size={11} aria-label="Enter" /></Kbd> Open</span>
          <span className="flex items-center gap-1.5"><Kbd>Esc</Kbd> Close</span>
          <span className="ml-auto">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
        </div>
      </div>
    </div>
  );
}
