import { createBrowserRouter } from "react-router";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminGatePage } from "./pages/admin/AdminGatePage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { ArticleListPage } from "./pages/ArticleListPage";
import { FacilitiesPage } from "./pages/FacilitiesPage";
import { FacilityDetailPage } from "./pages/FacilityDetailPage";
import { HelpPage } from "./pages/HelpPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProgramDetailPage } from "./pages/ProgramDetailPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { StatisticsPage } from "./pages/StatisticsPage";

export const routes = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "profil", element: <ProfilePage /> },
      { path: "edukasi", element: <ArticleListPage key="education" section="education" /> },
      { path: "edukasi/:slug", element: <ArticleDetailPage section="education" /> },
      { path: "fasilitas", element: <FacilitiesPage /> },
      { path: "fasilitas/:slug", element: <FacilityDetailPage /> },
      { path: "bantuan", element: <HelpPage /> },
      { path: "statistik", element: <StatisticsPage /> },
      { path: "program", element: <ProgramsPage /> },
      { path: "program/:slug", element: <ProgramDetailPage /> },
      { path: "berita", element: <ArticleListPage key="news" section="news" /> },
      { path: "berita/:slug", element: <ArticleDetailPage section="news" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  // Internal Management System — separate shell, no public chrome.
  { path: "/admin", element: <AdminGatePage /> },
  { path: "/admin/*", element: <AdminGatePage /> },
];

export const router = createBrowserRouter(routes);
