import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router";
import type { ProgramSummary } from "../../../shared/types";
import { formatDateRange, programStatusLabel } from "../../lib/format";
import { Badge, SampleBadge } from "../ui/Badge";
import { ContentImage } from "../ui/Photo";

const tone = { ongoing: "green", upcoming: "blue", completed: "neutral", cancelled: "danger" } as const;

export function ProgramCard({ program }: { program: ProgramSummary }) {
  return (
    <article className="card card--link">
      <div className="card__media">
        <ContentImage src={program.coverImage} alt="" placeholder="Dokumentasi belum tersedia" />
      </div>
      <div className="card__body">
        <div className="badges">
          <Badge tone={tone[program.programStatus]}>{programStatusLabel[program.programStatus]}</Badge>
          {program.isSample && <SampleBadge />}
        </div>
        <h3 className="card__title">
          <Link to={`/program/${program.slug}`}>{program.title}</Link>
        </h3>
        {program.summary && <p className="card__text">{program.summary}</p>}
        <div className="card__meta">
          <span>
            <CalendarDays aria-hidden="true" /> {formatDateRange(program.startDate, program.endDate)}
          </span>
          {program.location && (
            <span>
              <MapPin aria-hidden="true" /> {program.location}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
