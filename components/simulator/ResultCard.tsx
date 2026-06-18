import type { ReactNode } from "react";

type ResultCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function ResultCard({ icon, label, value }: ResultCardProps) {
  return (
    <div className="relative flex min-h-[112px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 sm:min-h-[132px] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-normal leading-snug text-white">
          {label}
          <span className="text-blue-light">{icon}</span>
        </p>
      </div>
      <div>
        <p className="mt-4 text-[1.35rem] font-normal leading-tight text-white sm:mt-5 md:text-[1.55rem]">{value}</p>
      </div>
    </div>
  );
}
