/** @type {import('tailwindcss').Config} */
function withVar(v) {
  return `rgb(var(${v}) / <alpha-value>)`;
}

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Theme-aware tokens backed by CSS variables (see src/index.css).
      colors: {
        base: withVar("--c-base"),
        surface: withVar("--c-surface"),
        "surface-2": withVar("--c-surface-2"),
        border: withVar("--c-border"),
        content: withVar("--c-content"),
        muted: withVar("--c-muted"),
        accent: withVar("--c-accent"),
        "accent-hover": withVar("--c-accent-hover"),
        onaccent: withVar("--c-on-accent"),
        danger: withVar("--c-danger"),
        success: withVar("--c-success"),
      },
      borderRadius: { xl: "12px", lg: "10px" },
      boxShadow: {
        panel: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
