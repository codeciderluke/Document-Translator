import { NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import {
  BookIcon,
  FileTextIcon,
  HistoryIcon,
  LanguagesIcon,
  UploadIcon,
} from "./icons";

const NAV = [
  { to: "/translate/text", label: "Text Translation", icon: FileTextIcon },
  { to: "/translate/document", label: "Document Translation", icon: UploadIcon },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/settings/glossaries", label: "Glossaries", icon: BookIcon },
];

export function AppLayout() {
  return (
    <div className="flex h-full">
      <aside className="no-print flex w-60 flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <LanguagesIcon />
          </div>
          <div>
            <div className="text-sm font-semibold text-content">Document Translator</div>
            <div className="text-[11px] text-muted">EN · JA · KO · ZH</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:bg-surface-2 hover:text-content"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-border px-3 py-3">
          <ThemeToggle />
          <p className="mt-2 px-3 text-center text-[11px] text-muted">
            Designed by Codecider Lab
          </p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
