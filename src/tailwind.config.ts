// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure it scans all your component files
  ],
  theme: {
    extend: {
      colors: {
        "primary-red": "#E84142",
        "bg-dark": "#0A0A0A",
        "bg-card": "#171717",
        "border-gray": "#333333",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A1A1A1",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"], // Set Manrope as the default sans-serif font
      },
    },
  },
  plugins: [],
};
