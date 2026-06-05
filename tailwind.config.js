/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
          900: "#312e81"
        },
        background: "#fcfcfc",
        border: "#e4e4e7",
        card: "#ffffff",
        foreground: "#18181b",
        ink: "#18181b",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        sidebar: "#f8f8fb",
        "brand-subtle": "#eef2ff"
      }
    }
  },
  plugins: []
};
