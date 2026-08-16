export type KeySpec = {
  id: number;
  x: number;
  z: number;
  hue: number;
};

export const KEY_W = 0.88;
export const KEY_H = 0.52;
export const KEY_D = 0.88;
export const KEY_CELL = 1.0;
export const KEY_LIFT = 0.42;
export const KEY_PRESS_SCALE = 0.42;

const MAX_COLS = 48;
const MAX_ROWS = 36;

export function generateKeyGrid(cols: number, rows: number, cell = KEY_CELL): KeySpec[] {
  const c = Math.max(1, Math.floor(cols));
  const r = Math.max(1, Math.floor(rows));
  const ox = ((c - 1) * cell) / 2;
  const oz = ((r - 1) * cell) / 2;
  const specs: KeySpec[] = [];
  let id = 0;
  for (let row = 0; row < r; row++) {
    for (let col = 0; col < c; col++) {
      const x = col * cell - ox;
      const z = row * cell - oz;
      specs.push({
        id: id++,
        x,
        z,
        hue: 0,
      });
    }
  }

  let minS = Infinity;
  let maxS = -Infinity;
  for (const spec of specs) {
    const s = spec.x - spec.z;
    if (s < minS) minS = s;
    if (s > maxS) maxS = s;
  }
  const span = Math.max(0.0001, maxS - minS);
  for (const spec of specs) {
    spec.hue = (spec.x - spec.z - minS) / span;
  }
  return specs;
}

export function gridForViewport(worldWidth: number, worldHeight: number): KeySpec[] {
  const w = Math.max(8, worldWidth) * 2.1;
  const h = Math.max(6, worldHeight) * 2.1;
  const cols = Math.min(MAX_COLS, Math.max(12, Math.ceil(w / KEY_CELL)));
  const rows = Math.min(MAX_ROWS, Math.max(10, Math.ceil(h / KEY_CELL)));
  return generateKeyGrid(cols, rows);
}
