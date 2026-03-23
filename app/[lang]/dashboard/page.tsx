import Link from "next/link";
import Image from "next/image";

const toolCategories = [
  {
    title: "Map Tools",
    description: "Spawnpoints, Kartenbereiche und Positionshilfen für Chernarus, Livonia und Sakhal.",
    tools: [
      { name: "Spawnpoint Generator", slug: "spawnpoint-generator", status: "Bereit" },
      { name: "Map Zone Planner", slug: "map-zone-planner", status: "Bald" },
      { name: "Route Builder", slug: "route-builder", status: "Bald" },
    ],
  },
  {
    title: "Config Tools",
    description: "Bearbeite DayZ-Konfigurationen schneller und übersichtlicher.",
    tools: [
      { name: "CFGGameplay Editor", slug: "cfg-gameplay-editor", status: "Bereit" },
      { name: "Weather Generator", slug: "weather-generator", status: "Bereit" },
      { name: "Message Generator", slug: "message-generator", status: "Bereit" },
    ],
  },
  {
    title: "Economy Tools",
    description: "Loot, Loadouts und Balancing für deinen Server anpassen.",
    tools: [
      { name: "Loadout Generator", slug: "loadout-generator", status: "Bereit" },
      { name: "Trader Generator", slug: "trader-generator", status: "Bald" },
      { name: "Loot Table Helper", slug: "loot-table-helper", status: "Bald" },
    ],
  },
  {
    title: "Converter & Validator",
    description: "Dateien prüfen, umwandeln und für DayZ vorbereiten.",
    tools: [
      { name: "JSON to DZE", slug: "json-to-dze", status: "Bereit" },
      { name: "JSON Validator", slug: "json-validator", status: "Bereit" },
      { name: "XML Validator", slug: "xml-validator", status: "Bereit" },
    ],
  },
];

const logoPath = "/logo-new.png";

export default function DashboardPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang === "en" ? "en" : "de";

  const navItems = [
    { label: "Dashboard", href: `/${lang}/dashboard` },
    { label: "Map Tools", href: `/${lang}/tools/spawnpoint-generator` },
    { label: "Config Tools", href: `/${lang}/tools/cfg-gameplay-editor` },
    { label: "Converter", href: `/${lang}/tools/json-to-dze` },
    { label: "Discord Bot", href: `/${lang}/dashboard` },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              <img
              src="/logo-new.png"
              alt="logo"
              className="h-10 w-10 object-contain"
            />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">Step Mod!Z</p>
              <p className="text-xs text-white/50">Free DayZ Mods · Tools Platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-transparent px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
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

      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-red-950/50 via-black to-green-950/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
              Step Mod!Z Dashboard
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Deine DayZ Tools an einem Ort.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
              Verwalte Generatoren, Editoren und Converter für deinen DayZ-Server in einer klaren Oberfläche.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                Zur Startseite
              </Link>
              <Link
                href={`/${lang}/tools/spawnpoint-generator`}
                className="rounded-2xl border border-green-500/30 bg-green-500/15 px-5 py-3 font-semibold text-green-300 transition hover:bg-green-500/20"
              >
                Spawnpoint Generator öffnen
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
            <div className="absolute h-72 w-72 rounded-full bg-green-600/20 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <img
            src="/logo-new.png"
            alt="logo"
            className="h-auto w-[220px] object-contain sm:w-[280px]"
          />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">Tool Kategorien</p>
            <h2 className="mt-2 text-3xl font-bold">Dashboard Übersicht</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
            Betreiber: StepDede_ModderZ
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {toolCategories.map((category) => (
            <div
              key={category.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">{category.title}</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  {category.tools.length} Tools
                </span>
              </div>

              <p className="mb-6 text-sm leading-6 text-white/65">{category.description}</p>

              <div className="space-y-3">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={`/${lang}/tools/${tool.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 transition hover:border-green-500/30 hover:bg-green-500/10"
                  >
                    <span className="font-medium text-white/90">{tool.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        tool.status === "Bereit"
                          ? "bg-green-500/15 text-green-300"
                          : "bg-yellow-500/15 text-yellow-300"
                      }`}
                    >
                      {tool.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}