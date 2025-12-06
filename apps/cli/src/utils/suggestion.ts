export function suggest(
  input: string,
  options: readonly string[],
): string | null {
  let best: string | null = null;
  let bestDistance = 3;
  for (const opt of options) {
    const distance = levenshtein(input.toLowerCase(), opt.toLowerCase());
    if (distance < bestDistance) {
      bestDistance = distance;
      best = opt;
    }
  }
  return best;
}

function levenshtein(a: string, b: string): number {
  // Pre-initialize the full matrix to avoid undefined access
  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  );

  for (let i = 1; i <= b.length; i++) {
    const row = matrix[i];
    const prevRow = matrix[i - 1];
    if (!row || !prevRow) continue;

    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      row[j] = Math.min(
        (prevRow[j - 1] ?? 0) + cost,
        (row[j - 1] ?? 0) + 1,
        (prevRow[j] ?? 0) + 1,
      );
    }
  }

  return matrix[b.length]?.[a.length] ?? 0;
}
