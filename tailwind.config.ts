import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // intro world — charcoal panel on a warm grey shell, chalk-grey type
        shell: '#C9C8C4',
        charcoal: '#212225',
        chalk: '#C8C7C3',
        // content world
        paper: '#F4F3F0',
        ink: '#18181A',
        muted: '#61615F',
        faint: '#93938F',
        rule: '#DEDCD7',
        accent: '#B4502A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
