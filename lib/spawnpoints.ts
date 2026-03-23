export type Spawnpoint = {
  id: string;
  lat: number;
  lng: number;
  type?: string;
};

export type GeneratorSettings = {
  count: number;
  radius: number;
  minDistance: number;
  seed: string;
};

export function generateSpawnpoints(
  centerLat: number,
  centerLng: number,
  settings: GeneratorSettings
): Spawnpoint[] {
  const points: Spawnpoint[] = [];

  const seedNumber = stringToSeed(settings.seed);
  const random = mulberry32(seedNumber);

  let attempts = 0;
  const maxAttempts = settings.count * 50;

  while (points.length < settings.count && attempts < maxAttempts) {
    attempts++;

    const angle = random() * Math.PI * 2;
    const distance = random() * settings.radius;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    const lat = centerLat + dy * 0.00001;
    const lng = centerLng + dx * 0.00001;

    const isFarEnough = points.every((p) => {
      const dLat = p.lat - lat;
      const dLng = p.lng - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      return dist >= settings.minDistance * 0.00001;
    });

    if (!isFarEnough) continue;

    points.push({
      id: crypto.randomUUID(),
      lat,
      lng,
      type: "generated",
    });
  }

  return points;
}

function stringToSeed(value: string): number {
  let h = 1779033703 ^ value.length;

  for (let i = 0; i < value.length; i++) {
    h = Math.imul(h ^ value.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  return (h >>> 0) || 1;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}