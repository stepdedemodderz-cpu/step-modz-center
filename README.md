# Step Mod!Z Platform

Originale DayZ Tool Plattform für **Step Mod!Z** mit Landingpage, Sprachwahl, Dashboard, Generatoren, Karten-Tool und Discord-Bot Starter.

## Enthalten

- Hauptseite mit Logo, Sprachwahl und Step Mod!Z Button
- Dashboard mit Tool-Karten
- 12 Generatoren / Editoren / Validatoren
- Spawnpoint Builder mit Chernarus, Livonia und Sakhal Auswahl
- Discord Bot Starter mit Slash Commands
- GitHub + Vercel taugliche Next.js Struktur

## Tools

- messages.xml Generator
- cfggameplay.json Editor
- Loadout Generator
- Tag/Nacht Rechner
- Weather Manager
- Spawnpoint Generator
- globals.xml Editor
- Rvmat Generator
- JSON zu DZE
- Types Splitter
- Types Updater
- JSON Validator
- XML Validator

## Lokal starten

```bash
npm install
npm run dev
```

Dann im Browser `http://localhost:3000` öffnen.

## Vercel Deploy

1. Neues GitHub Repository anlegen
2. Projekt pushen
3. In Vercel `New Project` wählen
4. Repository verbinden
5. Deploy starten

## Discord Bot

`.env.example` zu `.env.local` oder `.env` kopieren und die Discord Daten eintragen.

```bash
npm install
npm run bot
```

## Wichtiger Hinweis

Die Seite ist **nicht 1:1 kopiert**, sondern als eigene originale Plattform umgesetzt, nur an der gewünschten Struktur orientiert. Damit kannst du sie sauber weiterentwickeln und später einzeln pro Seite ausbauen.
