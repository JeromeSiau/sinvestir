import { LineChart, Table2 } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../../lib/classnames";

export type ChartTab = "graphs" | "calendar";

const TAB_BUTTON_CLASS =
  "flex items-center gap-3 rounded-full px-6 py-3 text-base transition";

type ChartTabsProps = {
  activeTab: ChartTab;
  onTabChange: (tab: ChartTab) => void;
};

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-selected={active}
      className={cx(
        TAB_BUTTON_CLASS,
        active
          ? "bg-white/5 text-white"
          : "text-white/55 hover:bg-white/[0.02] hover:text-white",
      )}
      role="tab"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ChartTabs({ activeTab, onTabChange }: ChartTabsProps) {
  return (
    <div className="mx-auto flex w-fit flex-row items-center gap-2.5 rounded-full border border-white/10 bg-white/5 p-2.5">
      <TabButton active={activeTab === "graphs"} onClick={() => onTabChange("graphs")}>
        <LineChart size={18} />
        Graphiques
      </TabButton>
      <TabButton active={activeTab === "calendar"} onClick={() => onTabChange("calendar")}>
        <Table2 size={18} />
        Calendrier
      </TabButton>
    </div>
  );
}
