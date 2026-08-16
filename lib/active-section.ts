/**
 * Pick the notebook section sitting on the spy line.
 * Last section whose top is at or above the line wins, so scrolling
 * both directions maps 1:1 to the outline. At the document bottom,
 * always pin the last cell so short closing sections still activate.
 */
export function resolveActiveIndex(
  tops: number[],
  spyY: number,
  atBottom: boolean
): number {
  if (tops.length === 0) return 0;
  if (atBottom) return tops.length - 1;
  let active = 0;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= spyY) active = i;
    else break;
  }
  return active;
}
