import Link from "next/link";

export function Topbar({ lang = "de" }: { lang?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
            <img
              src="/logo-new.png?v=2"
              alt="Step Mod!Z Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-white">Step Mod!Z</p>
            <p className="text-xs text-white/50">Free DayZ Mods · Tools Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <Link
            href={`/${lang}/dashboard`}
            className="rounded-2xl px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href={`/${lang}/tools/spawnpoint-generator`}
            className="rounded-2xl px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Map Tools
          </Link>
          <Link
            href={`/${lang}/tools/cfg-gameplay-editor`}
            className="rounded-2xl px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Config Tools
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 sm:block">
            StepDede_ModderZ
          </div>
          <Link
            href={`/${lang}/tools/spawnpoint-generator`}
            className="rounded-2xl border border-green-500/30 bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-500/20"
          >
            Tools öffnen
          </Link>
        </div>
      </div>
    </header>
  );
}