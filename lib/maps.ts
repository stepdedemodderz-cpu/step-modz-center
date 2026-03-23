export type DayzMapKey = "chernarus" | "livonia" | "sakhal";

export type DayzMapConfig = {
  key: DayzMapKey;
  label: string;
  imageUrl: string;
  bounds: [[number, number], [number, number]];
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
};

const DEFAULT_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [1000, 1000],
];

export const DAYZ_MAPS: Record<DayzMapKey, DayzMapConfig> = {
  chernarus: {
    key: "chernarus",
    label: "Chernarus",
    imageUrl: "/maps/chernarus.jpg",
    bounds: DEFAULT_BOUNDS,
    center: [500, 500],
    zoom: 0,
    minZoom: -2,
    maxZoom: 3,
  },
  livonia: {
    key: "livonia",
    label: "Livonia",
    imageUrl: "/maps/livonia.jpg",
    bounds: DEFAULT_BOUNDS,
    center: [500, 500],
    zoom: 0,
    minZoom: -2,
    maxZoom: 3,
  },
  sakhal: {
    key: "sakhal",
    label: "Sakhal",
    imageUrl: "/maps/sakhal.jpg",
    bounds: DEFAULT_BOUNDS,
    center: [500, 500],
    zoom: 0,
    minZoom: -2,
    maxZoom: 3,
  },
};