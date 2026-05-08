export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">
            Hotel AI
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Crafted for modern hotel teams. Intelligent guest support, polished
            design, and smooth workflow for luxury hospitality experiences.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms
            </a>
            <a href="#" className="transition hover:text-white">
              Support
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-sm">Connect</span>
            <a href="#" className="transition hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="transition hover:text-white">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
