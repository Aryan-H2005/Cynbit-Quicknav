import { useEffect, useState } from 'react';
import CommandPalette from './components/CommandPalette.jsx';
import SearchTrigger from './components/SearchTrigger.jsx';
import { CATEGORIES, destinations } from './data/navigation.js';
import { openDestination } from './lib/navigate.js';
import { shortcutLabel } from './lib/platform.js';

function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="text-lg font-bold">Cynbit</span>;
  return <img src="https://www.cynbit.in/logo.svg" alt="Cynbit" className="h-8 w-auto" onError={() => setFailed(true)} />;
}

export default function App() {
  const [open, setOpen] = useState(false);

  // Ctrl/Cmd + K only. Plain letters are never captured, so typing in fields is unaffected.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.isComposing || e.altKey || e.shiftKey) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">QuickNav prototype</span>
          </div>
          <SearchTrigger onOpen={() => setOpen(true)} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="py-14 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Find any Cynbit page in a few keystrokes.</h1>
          <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400">
            Press <strong>{shortcutLabel()}</strong> anywhere on the page, type what you need (try “about”, “jobs” or “reviews”), and press Enter. Pages open on cynbit.in in a new tab.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => setOpen(true)} className="h-11 rounded-xl bg-brand-600 px-5 font-medium text-white hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
              Open QuickNav
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              Typing check
              <input type="text" placeholder="Type k here, nothing happens" className="h-10 w-56 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </label>
          </div>
        </section>

        <section aria-labelledby="map-title" className="pb-16">
          <h2 id="map-title" className="text-xl font-semibold">What QuickNav can open</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{destinations.length} destinations taken from cynbit.in’s own menus and Navigation Map.</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <div key={category}>
                <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{category}</h3>
                <ul className="space-y-1.5 text-sm">
                  {destinations.filter((d) => d.category === category).map((d) => (
                    <li key={d.id}>
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 dark:text-brand-400">{d.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p className="mx-auto max-w-5xl px-4">
          An independent improvement prototype made for the Cynbit website challenge. It is not part of the official Cynbit website. Cynbit names and logo belong to Cynbit Technologies.
        </p>
      </footer>

      <CommandPalette open={open} onClose={() => setOpen(false)} destinations={destinations} onNavigate={openDestination} />
    </div>
  );
}
