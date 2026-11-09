import { Search, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { t } from "../../i18n";

/** Search box with a short debounce; `onChange` fires with the trimmed value. */
export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  delay = 300,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  delay?: number;
}) {
  const id = useId();
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (draft.trim() === value) return;
    const h = setTimeout(() => onChange(draft.trim()), delay);
    return () => clearTimeout(h);
  }, [draft, value, onChange, delay]);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="search">
        <Search size={18} aria-hidden="true" />
        <input
          id={id}
          className="input"
          type="search"
          value={draft}
          maxLength={100}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onChange(draft.trim());
          }}
        />
        {draft && (
          <button
            type="button"
            className="search__clear"
            aria-label={t("common.clear")}
            onClick={() => {
              setDraft("");
              onChange("");
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
