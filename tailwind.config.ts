import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-black': '#0a0a0a',
        'retro-gray-dark': '#2a2a2a',
        'retro-gray': '#5a5a5a',
        'retro-gray-light': '#9a9a9a',
        'retro-white': '#e8e8e8',
        'retro-tan': '#d4c5b9',
        'retro-tan-dark': '#a89a8a',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
