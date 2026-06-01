import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xsm: "500px",
        xxl: "1280px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        textGray: "#71767b",
        textGrayLight: "#e7e9ea",
        borderGray: "#2f3336",
        inputGray: "#202327",
        iconBlue: "#1d9bf0",
        iconGreen: "#00ba7c",
        iconPink: "#f91880",
      },
    },
  },
  plugins: [],
} satisfies Config;
