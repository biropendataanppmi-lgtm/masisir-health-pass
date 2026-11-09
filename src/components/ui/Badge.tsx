import { BadgeCheck, CircleExclamationPoint, FlaskConical, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import type { VerificationStatus } from "../../../shared/types";
import { verificationLabel } from "../../lib/format";

type Tone = "default" | "blue" | "green" | "warning" | "danger" | "neutral";

export function Badge({ tone = "default", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge${tone === "default" ? "" : ` badge--${tone}`}`}>{children}</span>;
}

/** Marks development sample data. Shown wherever sample rows are rendered. */
export function SampleBadge() {
  return (
    <span className="badge badge--sample" title="Data contoh untuk pengembangan — bukan informasi nyata">
      <FlaskConical aria-hidden="true" /> Data contoh
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const icon =
    status === "verified" ? <BadgeCheck aria-hidden="true" /> : status === "needs_update" ? <RefreshCw aria-hidden="true" /> : <CircleExclamationPoint aria-hidden="true" />;
  const tone: Tone = status === "verified" ? "green" : status === "needs_update" ? "warning" : "neutral";
  return (
    <Badge tone={tone}>
      {icon} {verificationLabel[status]}
    </Badge>
  );
}
