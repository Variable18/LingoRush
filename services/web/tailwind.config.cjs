/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      colors: {
        // Semantic overrides using CSS Variables for Dark Mode
        white: "rgb(var(--color-bg-card) / <alpha-value>)", 
        "gray-50": "rgb(var(--color-bg-subtle) / <alpha-value>)",
        "gray-100": "rgb(var(--color-border) / <alpha-value>)",
        "gray-900": "rgb(var(--color-text-main) / <alpha-value>)",
        
        // Custom branding
        ink: "#0B0F14",
        surface: "#0F141A",
        paper: "#11161c",
        text: "rgb(var(--color-text-main) / <alpha-value>)",
        muted: "rgb(var(--color-text-muted) / <alpha-value>)", 
        line: "rgba(255,255,255,0.08)",
        accent: "#2EE6A6",
      },
      borderRadius: { "xl-2": "1.125rem" }
    }
  },
  plugins: []
}
