import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ffede4",
          100: "#ffdcc6",
          200: "#ffb785",
          300: "#f3944a",
          400: "#d37a34",
          500: "#b4621c",
          600: "#954a00",
          700: "#713700",
          800: "#502500",
          900: "#301400",
        },
        secondary: {
          50: "#ecf0ff",
          100: "#d6e3ff",
          200: "#a9c7ff",
          300: "#7bacfc",
          400: "#5f91e0",
          500: "#4377c4",
          600: "#255ea9",
          700: "#00468c",
          800: "#003063",
          900: "#001b3d",
        },
        tertiary: {
          50: "#f7f77c",
          100: "#e9e870",
          200: "#cccc57",
          300: "#b0b03e",
          400: "#959525",
          500: "#7b7b03",
          600: "#626200",
          700: "#494900",
          800: "#323200",
          900: "#1d1d00",
        },
        neutral: {
          4: "#120d0a",
          5: "#15100d",
          6: "#18120f",
          10: "#201a17",
          12: "#241e1b",
          17: "#2f2925",
          20: "#362f2b",
          22: "#3a3330",
          24: "#3f3834",
          25: "#413a36",
          30: "#4d4541",
          35: "#59514d",
          40: "#655d58",
          50: "#7e7570",
          60: "#998f8a",
          70: "#b4a9a4",
          80: "#d0c4bf",
          87: "#e3d8d2",
          90: "#ece0da",
          92: "#f2e6e0",
          94: "#f8ebe5",
          95: "#fbeee8",
          96: "#fef1eb",
          98: "#fff8f5",
          99: "#fffbff",
        },
        "neutral-variant": {
          4: "#150C06",
          5: "#180f08",
          6: "#1b110b",
          10: "#241912",
          12: "#281d16",
          17: "#332820",
          20: "#3a2e26",
          22: "#3f322a",
          24: "#43372e",
          25: "#463931",
          30: "#52443b",
          35: "#5e5047",
          40: "#6a5b52",
          50: "#84746a",
          60: "#9f8d83",
          70: "#baa89d",
          80: "#d7c3b7",
          87: "#ebd6ca",
          90: "#f3ded3",
          92: "#f9e4d8",
          94: "#ffeade",
          95: "#ffede4",
          96: "#fff1ea",
          98: "#fff8f5",
          99: "#fffbff",
        },
        error: {
          50: "#ffedea",
          100: "#ffdad6",
          200: "#ffb4ab",
          300: "#ff897d",
          400: "#ff5449",
          500: "#de3730",
          600: "#ba1a1a",
          700: "#93000a",
          800: "#690005",
          900: "#410002",
        },
        outline: "#84746a",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
} satisfies Config;
