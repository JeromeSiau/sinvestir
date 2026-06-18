import type { ReactNode } from "react";

type FieldLabelProps = {
  children: ReactNode;
  label: string;
  unit?: string;
};

export function FieldLabel({ children, label, unit }: FieldLabelProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-light text-blue-light">
        {label}
        {unit ? <span className="text-xs uppercase text-white/45">{unit}</span> : null}
      </span>
      {children}
    </label>
  );
}
