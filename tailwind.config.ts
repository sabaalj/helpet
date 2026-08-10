import type { Config } from "tailwindcss";

/**
 * Design tokens extracted from the Figma file
 * "Pet Paradise" — via Figma MCP get_variable_defs.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          1: "#8F00FF", // Primary/Purple1
          2: "#6F00C6", // Primary/Purple2
          3: "#410075", // Primary/Purple3
          4: "#E5C3FF", // Primary/Purple4
          5: "#F2E2FF", // Primary/Purple5
          wave: "#F1E0FF", // footer wave fill
        },
        green: {
          3: "#026D00", // Secondary/Green3
          4: "#6AB052", // Secondary/Green4
          5: "#A1BE97", // Secondary/Green5
          6: "#DFEFDA", // Secondary/Green6
        },
        red: {
          2: "#C80006", // Secondary/Red2
          3: "#8B0004", // Secondary/Red3
        },
        neutral: {
          200: "#CCCCCC",
          300: "#999999",
          600: "#727272",
          700: "#595959",
          800: "#252525",
        },
        yellow: {
          DEFAULT: "#E0B415", // System/Yellow
        },
        stone: {
          DEFAULT: "#343330",
        },
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "Assistant", "sans-serif"],
      },
      fontSize: {
        // Figma typography styles (Web/*)
        "display-36": ["36px", { lineHeight: "48px", fontWeight: "700" }], // 36px-Display/Bold
        "header-28": ["28px", { lineHeight: "36px", fontWeight: "700" }], // 28px-Header/Bold
        "display-24": ["24px", { lineHeight: "30px", fontWeight: "400" }], // 24px-Display/Regular
        "title-20": ["20px", { lineHeight: "26px", fontWeight: "700" }], // 20px-Tittle/Tittle
        "content-18": ["18px", { lineHeight: "22px" }], // 18px-Content
        "small-14": ["14px", { lineHeight: "18px" }], // 14px-Smallcontent
        "desc-12": ["12px", { lineHeight: "12px" }], // 12px-Description
      },
      letterSpacing: {
        title: "3px", // 20px-Tittle/UpperCase
      },
      borderRadius: {
        card: "10px",
        btn: "5px",
      },
      boxShadow: {
        chip: "0px 0px 15px rgba(0,0,0,0.1)",
        card: "0px 4px 20px rgba(65,0,117,0.08)",
        panel: "0px 0px 30px rgba(65,0,117,0.10)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
