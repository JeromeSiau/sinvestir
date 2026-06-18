import type { ReactNode } from "react";

type ResultCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function ResultCard({ icon, label, value }: ResultCardProps) {
  return (
    <div className="relative flex min-h-[154px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 sm:aspect-square sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-normal text-white">
          {label}
          <span className="text-blue-light">{icon}</span>
        </p>
      </div>
      <div>
        <p className="mt-5 whitespace-nowrap text-2xl font-normal text-white md:text-[1.55rem] xl:text-[1.65rem]">
          {value}
        </p>
      </div>
    </div>
  );
}
