import { Search } from 'lucide-react';
import Kbd from './Kbd.jsx';
import { shortcutLabel } from '../lib/platform.js';

export default function SearchTrigger({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Search pages. Shortcut ${shortcutLabel()}`}
      aria-haspopup="dialog"
      className="flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-500 transition hover:border-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:min-w-[15rem]"
    >
      <Search size={16} aria-hidden="true" />
      <span className="hidden flex-1 text-left sm:inline">Search pages...</span>
      <span className="hidden sm:inline"><Kbd>{shortcutLabel()}</Kbd></span>
    </button>
  );
}
