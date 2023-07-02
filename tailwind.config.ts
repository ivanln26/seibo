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
