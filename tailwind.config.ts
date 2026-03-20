import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Izakaya direct hex tokens
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d4c5ab",
        "surface": "#131313",
        "surface-container": "#20201f",
        "surface-container-low": "#1c1b1b",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353535",
        "surface-bright": "#393939",
        "surface-variant": "#353535",
        "surface-tint": "#fbbc00",
        "primary-container": "#ffbf00",
        "on-primary": "#402d00",
        "on-primary-container": "#6d5000",
        "secondary-container": "#802918",
        "on-secondary-container": "#ff9a85",
        "tertiary-container": "#ecc54b",
        "on-tertiary-container": "#675200",
        "outline": "#9c8f78",
        "outline-variant": "#504532",
        // shadcn CSS-var-based tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        headline: ["var(--font-newsreader)", "serif"],
        body: ["var(--font-noto-serif)", "serif"],
        label: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
