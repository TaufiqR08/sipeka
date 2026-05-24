import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          light: "#163A6B",
          dark: "#051632",
          50: "#F0F4F8",
          100: "#D9E2ED",
          200: "#B3C5DB",
          300: "#8CA9CA",
          400: "#668CB8",
          500: "#406FA7",
          600: "#1E5295",
          700: "#163A6B",
          800: "#0B2545",
          900: "#051632",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C96A",
          lighter: "#F5E0A0",
          50: "#FFFBF0",
          100: "#FEF5E7",
          200: "#FDE8D0",
          300: "#FCDAB8",
          400: "#FBCDA1",
          500: "#F9BF89",
          600: "#E8C96A",
          700: "#C9A84C",
          800: "#A88630",
          900: "#876415",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        "gradient-navy":
          "linear-gradient(135deg, #0B2545 0%, #163A6B 50%, #0B2545 100%)",
        "gradient-gold": "linear-gradient(90deg, #C9A84C 0%, #E8C96A 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(201, 168, 76, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
