import type { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { Photo, type ProjectPhoto } from "./Photo";

export function PageHero({
  eyebrow,
  title,
  lead,
  photo,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  photo?: ProjectPhoto;
  crumbs?: { label: string; to?: string }[];
  children?: ReactNode;
}) {
  return (
    <header className={`page-hero${photo ? " page-hero--photo" : ""}`}>
      {photo && <Photo name={photo} alt="" priority />}
      <div className="container">
        <div className="page-hero__inner">
          {crumbs && <Breadcrumb items={crumbs} />}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
