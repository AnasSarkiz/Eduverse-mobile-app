/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          900: "#172554"
        },
        accent: "#06b6d4",
        background: "#f7f9fc",
        border: "#dfe5ef",
        card: "#ffffff",
        foreground: "#111827",
        ink: "#111827",
        muted: "#eef2f7",
        "muted-foreground": "#64748b",
        sidebar: "#f1f5f9",
        "brand-subtle": "#eaf2ff",
        "dark-background": "#07111f",
        "dark-border": "#223049",
        "dark-card": "#0e1a2d",
        "dark-foreground": "#f8fafc",
        "dark-muted": "#17243a",
        "dark-muted-foreground": "#a8b3c7",
        "dark-brand-subtle": "#10264a"
      }
    }
  },
  plugins: []
};
