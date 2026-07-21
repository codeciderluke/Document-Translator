import { useTheme } from "@/lib/useTheme";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-content"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
