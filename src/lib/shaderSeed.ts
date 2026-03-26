// Brand palette colors as [r, g, b] normalized to 0-1
const BRAND_COLORS: [number, number, number][] = [
  [0, 0.898, 1], // cyan #00e5ff
  [0.482, 0.184, 0.745], // purple #7b2fbe
  [0.224, 1, 0.078], // green #39ff14
  [1, 0.549, 0], // orange #ff8c00
];

export interface ShaderSeed {
  seed1: number;
  seed2: number;
  seed3: number;
  colors: [[number, number, number], [number, number, number], [number, number, number]];
}

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function hashFloat(n: number): number {
  return ((Math.sin(n * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
}

export function slugToSeed(slug: string): ShaderSeed {
  const h = djb2(slug);
  const seed1 = hashFloat(h);
  const seed2 = hashFloat(h * 1.731);
  const seed3 = hashFloat(h * 2.459);

  // Pick 3 distinct colors from the palette
  const i0 = h % BRAND_COLORS.length;
  const i1 = (h * 7 + 1) % BRAND_COLORS.length;
  const i2Raw = (h * 13 + 2) % BRAND_COLORS.length;
  const i2 = i2Raw === i1 ? (i2Raw + 1) % BRAND_COLORS.length : i2Raw;

  return {
    seed1,
    seed2,
    seed3,
    colors: [BRAND_COLORS[i0], BRAND_COLORS[i1], BRAND_COLORS[i2]],
  };
}
