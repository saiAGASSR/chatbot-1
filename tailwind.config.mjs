/** @type {import('tailwindcss').Config} */
/** @type {import('material-tailwind/react').mtConfig } */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    },
  },
  plugins: [mtConfig],
};
