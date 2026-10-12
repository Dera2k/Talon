const UNIT_MS = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;

export function durationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) {
    throw new Error(`Invalid duration "${value}", expected e.g. "7d"`);
  }
  return Number(match[1]) * UNIT_MS[match[2] as keyof typeof UNIT_MS];
}
