/** ISO week period for KPI rollup (KPI-002). */
export type KpiPeriod = {
  key: string;
  start: Date;
  end: Date;
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Monday 00:00 UTC for the week containing `reference`. */
export function getWeekPeriod(reference: Date = new Date()): KpiPeriod {
  const utc = new Date(
    Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate())
  );
  const day = utc.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(utc);
  start.setUTCDate(utc.getUTCDate() + diffToMonday);

  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  const thursday = new Date(start);
  thursday.setUTCDate(start.getUTCDate() + 3);
  const year = thursday.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const weekNum = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
  );

  return {
    key: `${year}-W${pad2(weekNum)}`,
    start,
    end,
  };
}

export function countWeekdaysInclusive(start: Date, end: Date): number {
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const dow = cursor.getUTCDay();
    if (dow >= 1 && dow <= 5) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return Math.max(count, 1);
}
