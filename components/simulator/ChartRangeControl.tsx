"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import { MIN_CHART_RANGE_PERCENT, type ChartRange } from "../../lib/chart-utils";

const RANGE_COMMIT_DELAY_MS = 110;

type ChartRangeControlProps = {
  end: number;
  getLabel: (value: number) => string;
  onRangeCommit: (value: ChartRange) => void;
  start: number;
};

export function ChartRangeControl({ end, getLabel, onRangeCommit, start }: ChartRangeControlProps) {
  const [draftRange, setDraftRange] = useState({ start, end });
  const draftRangeRef = useRef(draftRange);
  const commitTimer = useRef<number | null>(null);

  useEffect(() => {
    const nextRange = { start, end };
    draftRangeRef.current = nextRange;
    setDraftRange(nextRange);
  }, [end, start]);

  useEffect(() => {
    return () => {
      if (commitTimer.current !== null) {
        window.clearTimeout(commitTimer.current);
      }
    };
  }, []);

  function commitRange(nextRange: ChartRange) {
    startTransition(() => {
      onRangeCommit(nextRange);
    });
  }

  function scheduleCommit(nextRange: ChartRange) {
    if (commitTimer.current !== null) {
      window.clearTimeout(commitTimer.current);
    }

    // Keep the thumb responsive while the heavier chart redraw happens after a stable range commit.
    commitTimer.current = window.setTimeout(() => {
      commitRange(nextRange);
      commitTimer.current = null;
    }, RANGE_COMMIT_DELAY_MS);
  }

  function updateDraftRange(nextRange: ChartRange) {
    draftRangeRef.current = nextRange;
    setDraftRange(nextRange);
    scheduleCommit(nextRange);
  }

  function flushCommit() {
    if (commitTimer.current !== null) {
      window.clearTimeout(commitTimer.current);
      commitTimer.current = null;
    }

    commitRange(draftRangeRef.current);
  }

  function updateStart(value: number) {
    updateDraftRange({
      end: draftRangeRef.current.end,
      start: Math.min(value, draftRangeRef.current.end - MIN_CHART_RANGE_PERCENT),
    });
  }

  function updateEnd(value: number) {
    updateDraftRange({
      end: Math.max(value, draftRangeRef.current.start + MIN_CHART_RANGE_PERCENT),
      start: draftRangeRef.current.start,
    });
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4 text-xs font-light text-blue-light">
        <span>{getLabel(draftRange.start)}</span>
        <span>{getLabel(draftRange.end)}</span>
      </div>
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-sky/60"
          style={{ left: `${draftRange.start}%`, right: `${100 - draftRange.end}%` }}
        />
        <input
          aria-label="Début de la période affichée"
          className="chart-range-input"
          max={100 - MIN_CHART_RANGE_PERCENT}
          min={0}
          step={1}
          type="range"
          value={draftRange.start}
          onBlur={flushCommit}
          onChange={(event) => updateStart(Number(event.target.value))}
          onPointerUp={flushCommit}
        />
        <input
          aria-label="Fin de la période affichée"
          className="chart-range-input"
          max={100}
          min={MIN_CHART_RANGE_PERCENT}
          step={1}
          type="range"
          value={draftRange.end}
          onBlur={flushCommit}
          onChange={(event) => updateEnd(Number(event.target.value))}
          onPointerUp={flushCommit}
        />
      </div>
    </div>
  );
}
