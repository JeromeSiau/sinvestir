import type { CSSProperties } from "react";

export const CHART_INITIAL_DIMENSION = {
  height: 360,
  width: 960,
};

export const CHART_SERIES_ANIMATION = {
  animationBegin: 0,
  animationDuration: 420,
  animationEasing: "ease-out",
  isAnimationActive: true,
} as const;

export const CHART_TOOLTIP_STYLE: CSSProperties = {
  background: "#071226",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 18,
  color: "white",
};
