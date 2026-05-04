import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16181D",
        paper: "#F7F8FB",
        mint: "#18A889",
        coral: "#EF6655",
        sun: "#F2B84B"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(30, 34, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
