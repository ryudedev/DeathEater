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
        primary: 'var(--primary)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        error: 'var(--error)',
        description: 'var(--description)',
        image: 'var(--image)',
        movie: 'var(--movie)',
        voice: 'var(--voice)',
        text: 'var(--text)',
        free: 'var(--free)',
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      borderColor: {
        input: '#DEDEDE',
      },
      dropShadow: {
        default: '0 7px 29px rgba(100, 100, 111, 0.2)',
      },
      padding: {
        '22': '87px',
      },
      gap: {
        '7': '28px',
      },
      keyframes: {
        grow: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' }, // 動的な幅に対応
        },
      },
      animation: {
        grow: 'grow 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
