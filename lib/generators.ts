const xml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function generateOutput(slug: string, values: Record<string, string>, spawns: { x: number; y: number; id: number; }[] = []) {
  switch (slug) {
    case 'messages-generator': {
      const countdowns = (values.countdowns || '').split(',').map((n) => n.trim()).filter(Boolean);
      return `<messages>\n  <welcome>${xml(values.welcome || '')}</welcome>\n${countdowns.map((time) => `  <message delay="${time}">Server ${xml(values.serverName || '')} restart in ${time} minutes</message>`).join('\n')}\n  <restart cycle="${values.restartMinutes || '240'}" />\n</messages>`;
    }
    case 'cfg-gameplay-editor':
      return JSON.stringify({
        version: 121,
        GeneralData: {
          disableThirdPerson: values.disable3PP === 'true',
          disableCrosshair: values.disableCrosshair === 'true',
          temperatureData: { objectTemperatureMin: Number(values.baseTemp || 18) },
          staminaData: { staminaMultiplier: Number(values.stamina || 1) },
        },
      }, null, 2);
    case 'loadout-generator':
      return `<loadout name="${xml(values.loadoutName || '')}">\n  <weapon>${xml(values.primaryWeapon || '')}</weapon>\n  <food>${xml(values.food || '')}</food>\n${(values.clothes || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => `  <item>${xml(item)}</item>`).join('\n')}\n</loadout>`;
    case 'day-night-calculator': {
      const day = Number(values.dayLength || 4);
      const night = Number(values.nightLength || 1);
      const cycle = day + night;
      return JSON.stringify({ sunrise: values.sunrise || '06:00', dayHours: day, nightHours: night, fullCycleHours: cycle, nightPercentage: `${((night / cycle) * 100).toFixed(1)}%` }, null, 2);
    }
    case 'weather-manager':
      return `<weather reset="1" enable="1">\n  <overcast min="${values.overcast}" max="${values.overcast}" time="1200" />\n  <fog min="${values.fog}" max="${values.fog}" time="900" />\n  <rain min="${values.rain}" max="${values.rain}" time="1500" />\n  <wind magnitude="${values.wind}" />\n</weather>`;
    case 'spawnpoint-generator':
      return `<spawns map="${values.map}" name="${values.spawnName}" limit="${values.playerLimit}">\n${spawns.map((spawn) => `  <pos x="${spawn.x.toFixed(2)}" z="${spawn.y.toFixed(2)}" />`).join('\n')}\n</spawns>`;
    case 'globals-editor':
      return `<globals>\n  <var name="CleanupLifetime" value="${values.cleanupLifetime}" />\n  <var name="AnimalRespawnTime" value="${values.respawnTimer}" />\n  <var name="TimeAcceleration" value="${values.timeAcceleration}" />\n</globals>`;
    case 'rvmat-generator':
      return `class StageTI\n{\n  texture = "${values.texture}";\n};\n\nclass Stage1\n{\n  texture = "${values.normal}";\n};\n\nambient[] = {1,1,1,1};\ndiffuse[] = {1,1,1,1};\nforcedDiffuse[] = {0,0,0,0};\nspecular[] = {0.2,0.2,0.2,1};\nspecularPower = 20;\npixelShader = "Super";\nvertexShader = "${values.material || 'Super'}";`;
    case 'json-to-dze': {
      try {
        const parsed = JSON.parse(values.jsonInput || '[]');
        return parsed.map((entry: any, index: number) => `[${index}] ${entry.name || 'Object'} @ ${Array.isArray(entry.pos) ? entry.pos.join(', ') : '0,0,0'}`).join('\n');
      } catch {
        return 'Ungültiges JSON. Bitte Input prüfen.';
      }
    }
    case 'types-splitter': {
      const input = values.typesInput || '';
      const military = input.includes('Military');
      return JSON.stringify({ hasMilitaryCategory: military, recommendation: military ? 'Military Kategorie erkannt.' : 'Keine eindeutige Kategorie erkannt.', preview: input.slice(0, 240) }, null, 2);
    }
    case 'types-updater':
      return JSON.stringify({ current: values.currentVersion, target: values.targetVersion, tasks: ['Neue Items vergleichen', 'Events prüfen', 'cfgspawnabletypes abgleichen'], notes: values.notes }, null, 2);
    case 'json-validator': {
      try {
        return JSON.stringify(JSON.parse(values.jsonToValidate || '{}'), null, 2);
      } catch (error) {
        return `JSON Fehler: ${(error as Error).message}`;
      }
    }
    case 'xml-validator': {
      const input = values.xmlToValidate || '';
      const valid = input.startsWith('<') && input.endsWith('>') && input.includes('</');
      return valid ? `XML scheint strukturell gültig zu sein.\n\n${input}` : 'XML wirkt unvollständig. Prüfe öffnende und schließende Tags.';
    }
    default:
      return 'Tool noch nicht verbunden.';
  }
}
