export const site = {
  name: 'Step Mod!Z',
  owner: 'StepDede_ModderZ',
  discord: 'StepDede_ModderZ',
  slogan: {
    de: 'DayZ Generatoren, Tools und Discord-Anbindung in einem Hub.',
    en: 'DayZ generators, tools, and Discord integration in one hub.',
  },
};

export type Lang = 'de' | 'en';

export const copy = {
  de: {
    chooseLanguage: 'Sprache wählen',
    enter: 'Zu Step Mod!Z',
    dashboard: 'Dashboard',
    tools: 'Tools',
    overview: 'Übersicht',
    primaryCta: 'Tool öffnen',
    back: 'Zurück',
    generatedOutput: 'Generierter Output',
    generatorHub: 'Generator Hub',
    heroTitle: 'Dein eigener DayZ Tools Bereich – modern, schnell und bereit für Vercel.',
    heroText: 'Original aufgebaut, inspiriert vom Stil etablierter DayZ Tool Seiten, aber als eigene Step Mod!Z Plattform umgesetzt. Mit Landingpage, Dashboard, Generatoren, Kartenbereichen und Discord-Bot Starter.',
    stats: ['12 Generatoren', '3 Karten', 'Discord Bot ready'],
    discord: 'Discord Bot',
    github: 'GitHub & Vercel',
    maps: 'Karten',
    navTools: 'Alle Tools',
    navHome: 'Hauptseite',
    navDiscord: 'Discord Bot',
    navGuide: 'Deployment Guide',
  },
  en: {
    chooseLanguage: 'Choose language',
    enter: 'Enter Step Mod!Z',
    dashboard: 'Dashboard',
    tools: 'Tools',
    overview: 'Overview',
    primaryCta: 'Open tool',
    back: 'Back',
    generatedOutput: 'Generated output',
    generatorHub: 'Generator Hub',
    heroTitle: 'Your own DayZ tools area – modern, fast, and ready for Vercel.',
    heroText: 'Built as an original Step Mod!Z platform inspired by established DayZ tool hubs. Includes landing page, dashboard, generators, map areas, and a Discord bot starter.',
    stats: ['12 generators', '3 maps', 'Discord bot ready'],
    discord: 'Discord Bot',
    github: 'GitHub & Vercel',
    maps: 'Maps',
    navTools: 'All tools',
    navHome: 'Main page',
    navDiscord: 'Discord Bot',
    navGuide: 'Deployment Guide',
  },
} as const;

export type ToolDefinition = {
  slug: string;
  title: string;
  category: string;
  description: string;
  fields: { key: string; label: string; type: 'text' | 'number' | 'textarea' | 'select'; placeholder?: string; options?: string[]; defaultValue?: string; }[];
};

export const tools: ToolDefinition[] = [
  {
    slug: 'messages-generator',
    title: 'messages.xml Generator',
    category: 'Server',
    description: 'Erstellt Restart- und Welcome-Messages für DayZ Server.',
    fields: [
      { key: 'serverName', label: 'Server Name', type: 'text', defaultValue: 'Step Mod!Z' },
      { key: 'restartMinutes', label: 'Restart alle X Minuten', type: 'number', defaultValue: '240' },
      { key: 'welcome', label: 'Welcome Nachricht', type: 'text', defaultValue: 'Willkommen auf Step Mod!Z' },
      { key: 'countdowns', label: 'Countdown Zeiten', type: 'text', defaultValue: '60,30,15,10,5,1' },
    ],
  },
  {
    slug: 'cfg-gameplay-editor',
    title: 'cfggameplay.json Editor',
    category: 'Server',
    description: 'Generiert eine brauchbare cfggameplay.json Vorlage.',
    fields: [
      { key: 'disable3PP', label: '3PP deaktivieren', type: 'select', options: ['true', 'false'], defaultValue: 'true' },
      { key: 'disableCrosshair', label: 'Fadenkreuz deaktivieren', type: 'select', options: ['true', 'false'], defaultValue: 'true' },
      { key: 'baseTemp', label: 'Basistemperatur', type: 'number', defaultValue: '18' },
      { key: 'stamina', label: 'Stamina Multiplikator', type: 'number', defaultValue: '1.0' },
    ],
  },
  {
    slug: 'loadout-generator',
    title: 'Loadout Generator',
    category: 'Player',
    description: 'Erstellt Startausrüstung für Spieler.',
    fields: [
      { key: 'loadoutName', label: 'Loadout Name', type: 'text', defaultValue: 'Step Survivor' },
      { key: 'primaryWeapon', label: 'Waffe', type: 'text', defaultValue: 'M4A1' },
      { key: 'food', label: 'Food Item', type: 'text', defaultValue: 'BakedBeansCan' },
      { key: 'clothes', label: 'Kleidung, getrennt mit Komma', type: 'text', defaultValue: 'TShirt_Black,Jeans_Black,Sneakers_Black' },
    ],
  },
  {
    slug: 'day-night-calculator',
    title: 'Tag/Nacht Rechner',
    category: 'Server',
    description: 'Berechnet Sonnenaufgang, Sonnenuntergang und Dauer.',
    fields: [
      { key: 'dayLength', label: 'Tagesdauer in Stunden', type: 'number', defaultValue: '4' },
      { key: 'nightLength', label: 'Nachtdauer in Stunden', type: 'number', defaultValue: '1' },
      { key: 'sunrise', label: 'Sonnenaufgang', type: 'text', defaultValue: '06:00' },
    ],
  },
  {
    slug: 'weather-manager',
    title: 'Weather Manager',
    category: 'Server',
    description: 'Erstellt eine cfgweather.xml Vorlage.',
    fields: [
      { key: 'overcast', label: 'Bewölkung 0-1', type: 'number', defaultValue: '0.4' },
      { key: 'fog', label: 'Nebel 0-1', type: 'number', defaultValue: '0.05' },
      { key: 'rain', label: 'Regen 0-1', type: 'number', defaultValue: '0.2' },
      { key: 'wind', label: 'Wind 0-50', type: 'number', defaultValue: '12' },
    ],
  },
  {
    slug: 'spawnpoint-generator',
    title: 'Spawnpoint Generator',
    category: 'Maps',
    description: 'Setzt Spawnpunkte auf Chernarus, Livonia oder Sakhal.',
    fields: [
      { key: 'map', label: 'Karte', type: 'select', options: ['chernarus', 'livonia', 'sakhal'], defaultValue: 'chernarus' },
      { key: 'spawnName', label: 'Spawn Gruppenname', type: 'text', defaultValue: 'coast-spawn' },
      { key: 'playerLimit', label: 'Spawn limit', type: 'number', defaultValue: '24' },
    ],
  },
  {
    slug: 'globals-editor',
    title: 'globals.xml Editor',
    category: 'Server',
    description: 'Generiert häufige globale Server-Werte.',
    fields: [
      { key: 'cleanupLifetime', label: 'Cleanup Lifetime', type: 'number', defaultValue: '3888000' },
      { key: 'respawnTimer', label: 'Animal Respawn', type: 'number', defaultValue: '1200' },
      { key: 'timeAcceleration', label: 'Time Acceleration', type: 'number', defaultValue: '6' },
    ],
  },
  {
    slug: 'rvmat-generator',
    title: 'Rvmat Generator',
    category: 'Modding',
    description: 'Erstellt eine einfache rvmat Struktur.',
    fields: [
      { key: 'texture', label: 'Texture Pfad', type: 'text', defaultValue: 'stepmodz/data/wall_co.paa' },
      { key: 'normal', label: 'Normal Map Pfad', type: 'text', defaultValue: 'stepmodz/data/wall_nohq.paa' },
      { key: 'material', label: 'Materialtyp', type: 'text', defaultValue: 'Super' },
    ],
  },
  {
    slug: 'json-to-dze',
    title: 'JSON zu DZE',
    category: 'Convert',
    description: 'Wandelt Objektlisten in ein DZE-ähnliches Layout um.',
    fields: [
      { key: 'jsonInput', label: 'JSON Input', type: 'textarea', defaultValue: '[{"name":"Land_Wreck_Car3","pos":[7500,0,2500]}]' },
    ],
  },
  {
    slug: 'types-splitter',
    title: 'Types Splitter',
    category: 'Loot',
    description: 'Sortiert types.xml Inhalte nach Kategorie.',
    fields: [
      { key: 'typesInput', label: 'Types XML', type: 'textarea', defaultValue: '<types>\n  <type name="Ammo_556x45"><usage name="Military" /></type>\n</types>' },
    ],
  },
  {
    slug: 'types-updater',
    title: 'Types Updater',
    category: 'Loot',
    description: 'Markiert fehlende Einträge und Versionshinweise.',
    fields: [
      { key: 'currentVersion', label: 'Deine Version', type: 'text', defaultValue: '1.27' },
      { key: 'targetVersion', label: 'Zielversion', type: 'text', defaultValue: '1.28' },
      { key: 'notes', label: 'Bekannte Änderungen', type: 'textarea', defaultValue: 'Prüfe Waffen, Munition, Events und DLC-spezifische Spawns.' },
    ],
  },
  {
    slug: 'json-validator',
    title: 'JSON Validator',
    category: 'Validator',
    description: 'Prüft JSON und formatiert es.',
    fields: [
      { key: 'jsonToValidate', label: 'JSON Daten', type: 'textarea', defaultValue: '{"server":"Step Mod!Z","slots":60}' },
    ],
  },
  {
    slug: 'xml-validator',
    title: 'XML Validator',
    category: 'Validator',
    description: 'Prüft XML-Grundstruktur.',
    fields: [
      { key: 'xmlToValidate', label: 'XML Daten', type: 'textarea', defaultValue: '<root><server>Step Mod!Z</server></root>' },
    ],
  },
];

export const bySlug = Object.fromEntries(tools.map((tool) => [tool.slug, tool]));
