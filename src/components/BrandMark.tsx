// TEMPORARY brand mark. No official logo was supplied with the project assets.
// Replace this component (or point it to /images/logo.svg) once Menkes PPMI
// Mesir provides the official logo — see docs/ASSETS.md.
export function BrandMark({ className = "brand__mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect x="1" y="5" width="38" height="30" rx="8" fill="#123F46" />
      <rect x="5" y="9" width="14" height="22" rx="4" fill="#79B99A" />
      <path d="M10.5 14.5h3v3.5H17v3h-3.5v3.5h-3V21H7v-3h3.5z" fill="#fff" />
      <rect x="23" y="13" width="12" height="2.6" rx="1.3" fill="#E9F3EF" />
      <rect x="23" y="18.7" width="9" height="2.6" rx="1.3" fill="#79B99A" />
      <rect x="23" y="24.4" width="11" height="2.6" rx="1.3" fill="#347F91" />
    </svg>
  );
}
