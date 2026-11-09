import { FlaskConical, Hospital, MapPin, Pill, Stethoscope, Building, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import type { FacilitySummary } from "../../../shared/types";
import { SampleBadge, VerificationBadge } from "../ui/Badge";

export const facilityIcon: Record<string, LucideIcon> = {
  "rumah-sakit": Hospital,
  klinik: Stethoscope,
  dokter: Stethoscope,
  apotek: Pill,
  laboratorium: FlaskConical,
};

export function FacilityCard({ facility }: { facility: FacilitySummary }) {
  const Icon = facilityIcon[facility.type.slug] ?? Building;
  return (
    <article className="card card--link facility-card">
      <div className="card__body">
        <span className="facility-card__type">
          <Icon size={16} aria-hidden="true" /> {facility.type.name}
        </span>
        <h3 className="card__title">
          <Link to={`/fasilitas/${facility.slug}`}>{facility.name}</Link>
        </h3>
        <p className="facility-card__addr">
          <MapPin aria-hidden="true" />
          <span>
            {facility.address ?? "Alamat belum tersedia"}
            {facility.region && ` · ${facility.region.name}`}
          </span>
        </p>
        <div className="facility-card__foot">
          <VerificationBadge status={facility.verificationStatus} />
          {facility.isSample && <SampleBadge />}
        </div>
      </div>
    </article>
  );
}
