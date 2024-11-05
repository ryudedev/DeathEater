import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        // foreground: 'var(--foreground)',
        input: '#DEDEDE',
        foreground: '#1E9A9A',
        ring: '#1E9A9A',
      },
      borderColor: {
        input: '#DEDEDE',
      },
      dropShadow: {
        default: '0 7px 29px rgba(100, 100, 111, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
