import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

export interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

/** Segmented tab control with arrow-key navigation (WAI-ARIA tabs pattern). */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => {
    const n = (i + options.length) % options.length;
    onChange(options[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {options.map((o, i) => {
        const Icon = o.icon;
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") move(i + 1);
              if (e.key === "ArrowLeft") move(i - 1);
            }}
          >
            {Icon && <Icon size={16} aria-hidden="true" />} {o.label}
          </button>
        );
      })}
    </div>
  );
}
