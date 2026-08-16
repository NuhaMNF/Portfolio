/**
 * Fplus-style mail crystal geometry.
 * Rectangle + downward V flap; sparse bright points; wide-radius faint mesh.
 */

export const ENVELOPE_BOUNDS = {
  minX: -1.36,
  maxX: 1.36,
  minY: -0.82,
  maxY: 0.82,
  maxAbsZ: 0.07,
};

/** Wider link distance — denser spiderweb without adding particles. */
const LINK_RADIUS = 0.98;
const LINK_RADIUS_SQ = LINK_RADIUS * LINK_RADIUS;
const MIN_DEGREE = 3;
const MAX_DEGREE = 12;
const MAX_SEGMENTS = 14000;
/** Most particles sit on the outline; a smaller fill builds the interior web. */
const INTERIOR_BUDGET_FRACTION = 0.38;

type Seg = readonly (readonly [number, number, number])[];

/** Classic closed envelope: outer rect + V flap apex just below mid-height. */
const OUTLINE_SEGMENTS: readonly Seg[] = [
  // Outer rectangle TL → TR → BR → BL → TL
  [
    [-1.36, 0.82, 0],
    [1.36, 0.82, 0],
    [1.36, -0.82, 0],
    [-1.36, -0.82, 0],
    [-1.36, 0.82, 0],
  ],
  // Flap: TL → apex → TR (apex near vertical center)
  [
    [-1.36, 0.82, 0],
    [0, -0.04, 0],
    [1.36, 0.82, 0],
  ],
];

const TOTAL_OUTLINE_LENGTH = OUTLINE_SEGMENTS.reduce(
  (acc, seg) => acc + polylineLength(seg),
  0,
);

let memo: ReturnType<typeof build> | null = null;
let memoKey = '';

export function buildEnvelopeGeometry(count: number) {
  const key = `${count}:${LINK_RADIUS}:${MAX_DEGREE}`;
  if (memo && memoKey === key) return memo;
  memo = build(count);
  memoKey = key;
  return memo;
}

export function __resetEnvelopeGeometryMemo() {
  memo = null;
  memoKey = '';
}

function build(count: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const outlineCount = Math.round(count * (1 - INTERIOR_BUDGET_FRACTION));
  const interiorCount = count - outlineCount;

  for (let i = 0; i < outlineCount; i++) {
    const target = (i / Math.max(1, outlineCount)) * TOTAL_OUTLINE_LENGTH;
    const p = samplePolyline(OUTLINE_SEGMENTS, target);
    const idx = i * 3;
    // Soft outline jitter so the border feels fuzzy, not ruler-straight
    const jx = (hash01(i * 17 + 3) - 0.5) * 0.03;
    const jy = (hash01(i * 19 + 7) - 0.5) * 0.03;
    positions[idx] = p[0] + jx;
    positions[idx + 1] = p[1] + jy;
    positions[idx + 2] = (hash01(i) - 0.5) * 2 * ENVELOPE_BOUNDS.maxAbsZ;
    seeds[i] = hash01(i + 1);
  }

  for (let j = 0; j < interiorCount; j++) {
    const i = outlineCount + j;
    const idx = i * 3;
    // Keep interior inside the rect (not outside the silhouette)
    const u = hash01(i * 3 + 11);
    const v = hash01(i * 5 + 19);
    const x = ENVELOPE_BOUNDS.minX * 0.92 + u * (ENVELOPE_BOUNDS.maxX - ENVELOPE_BOUNDS.minX) * 0.92;
    const y = ENVELOPE_BOUNDS.minY * 0.92 + v * (ENVELOPE_BOUNDS.maxY - ENVELOPE_BOUNDS.minY) * 0.92;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = (hash01(i + 2) - 0.5) * 2 * ENVELOPE_BOUNDS.maxAbsZ;
    seeds[i] = hash01(i + 3);
  }

  const pairs = buildPairs(positions, count, outlineCount);
  return { positions, seeds, pairs, outlineCount };
}

function polylineLength(seg: Seg): number {
  let l = 0;
  for (let i = 1; i < seg.length; i++) {
    const dx = seg[i][0] - seg[i - 1][0];
    const dy = seg[i][1] - seg[i - 1][1];
    const dz = seg[i][2] - seg[i - 1][2];
    l += Math.hypot(dx, dy, dz);
  }
  return l;
}

function samplePolyline(segments: readonly Seg[], targetLen: number): [number, number, number] {
  let acc = 0;
  for (const seg of segments) {
    const len = polylineLength(seg);
    if (acc + len >= targetLen) {
      const localT = (targetLen - acc) / len;
      const span = seg.length - 1;
      const floatIdx = localT * span;
      const idx = Math.min(span, Math.floor(floatIdx) + 1);
      const prev = seg[idx - 1];
      const next = seg[idx];
      const t = floatIdx - (idx - 1);
      return [
        prev[0] + (next[0] - prev[0]) * t,
        prev[1] + (next[1] - prev[1]) * t,
        prev[2] + (next[2] - prev[2]) * t,
      ];
    }
    acc += len;
  }
  const last = segments[segments.length - 1];
  const tail = last[last.length - 1];
  return [tail[0], tail[1], tail[2]];
}

function dist2(positions: Float32Array, a: number, b: number): number {
  const dx = positions[a * 3] - positions[b * 3];
  const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
  const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
  return dx * dx + dy * dy + dz * dz;
}

/**
 * Distance mesh (fplus-style): link nearby particles within LINK_RADIUS,
 * keep outline chained, guarantee min degree 3, attach interior to border.
 */
function buildPairs(positions: Float32Array, count: number, outlineCount: number): Uint32Array {
  const degree = new Uint8Array(count);
  const adj: number[][] = Array.from({ length: count }, () => []);
  const seen = new Set<string>();
  const out: number[] = [];

  const addEdge = (a: number, b: number): boolean => {
    if (a === b) return false;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const key = `${lo}:${hi}`;
    if (seen.has(key)) return false;
    if (degree[a] >= MAX_DEGREE || degree[b] >= MAX_DEGREE) return false;
    if (out.length / 2 >= MAX_SEGMENTS) return false;
    seen.add(key);
    out.push(a, b);
    degree[a]++;
    degree[b]++;
    adj[a].push(b);
    adj[b].push(a);
    return true;
  };

  // Spatial hash
  const cellSize = LINK_RADIUS;
  const inv = 1 / cellSize;
  const buckets = new Map<string, number[]>();
  for (let i = 0; i < count; i++) {
    const cx = Math.floor(positions[i * 3] * inv);
    const cy = Math.floor(positions[i * 3 + 1] * inv);
    const key = `${cx},${cy}`;
    let arr = buckets.get(key);
    if (!arr) {
      arr = [];
      buckets.set(key, arr);
    }
    arr.push(i);
  }

  const nearby = (i: number): { j: number; d: number }[] => {
    const cx = Math.floor(positions[i * 3] * inv);
    const cy = Math.floor(positions[i * 3 + 1] * inv);
    const hits: { j: number; d: number }[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const arr = buckets.get(`${cx + dx},${cy + dy}`);
        if (!arr) continue;
        for (const j of arr) {
          if (j === i) continue;
          const d = dist2(positions, i, j);
          if (d <= LINK_RADIUS_SQ) hits.push({ j, d });
        }
      }
    }
    hits.sort((a, b) => a.d - b.d);
    return hits;
  };

  // 1) Outline chain
  for (let i = 0; i < outlineCount - 1; i++) addEdge(i, i + 1);

  // 2) Distance mesh — all pairs within LINK_RADIUS
  for (let i = 0; i < count; i++) {
    const hits = nearby(i);
    for (const { j } of hits) {
      if (j <= i) continue;
      addEdge(i, j);
    }
  }

  // 3) Attach any disconnected interior into the border component
  const connected = new Uint8Array(count);
  const q: number[] = [];
  for (let i = 0; i < outlineCount; i++) {
    connected[i] = 1;
    q.push(i);
  }
  while (q.length) {
    const u = q.pop()!;
    for (const v of adj[u]) {
      if (connected[v]) continue;
      connected[v] = 1;
      q.push(v);
    }
  }
  for (let i = outlineCount; i < count; i++) {
    if (connected[i]) continue;
    let best = -1;
    let bestD = Infinity;
    for (let j = 0; j < count; j++) {
      if (!connected[j]) continue;
      const d = dist2(positions, i, j);
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    if (best >= 0 && addEdge(i, best)) {
      connected[i] = 1;
      q.length = 0;
      q.push(i);
      while (q.length) {
        const u = q.pop()!;
        for (const v of adj[u]) {
          if (connected[v]) continue;
          connected[v] = 1;
          q.push(v);
        }
      }
    }
  }

  // 4) Guarantee min degree 3
  for (let i = 0; i < count; i++) {
    if (degree[i] >= MIN_DEGREE) continue;
    const hits = nearby(i);
    for (const { j } of hits) {
      if (degree[i] >= MIN_DEGREE) break;
      addEdge(i, j);
    }
    if (degree[i] < MIN_DEGREE) {
      const all: { j: number; d: number }[] = [];
      for (let j = 0; j < count; j++) {
        if (j === i) continue;
        all.push({ j, d: dist2(positions, i, j) });
      }
      all.sort((a, b) => a.d - b.d);
      for (const { j } of all) {
        if (degree[i] >= MIN_DEGREE) break;
        addEdge(i, j);
      }
    }
  }

  return Uint32Array.from(out);
}

function hash01(n: number): number {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (((t ^ (t >>> 14)) >>> 0) % 100000) / 100000;
}
