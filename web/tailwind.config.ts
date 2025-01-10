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
        hover: 'var(--hover)',
        alert_border_text_60: 'var(--alert-border-text-60)',
        alert_border_text_70: 'var(--alert-border-text-70)',
        alert_border_text_80: 'var(--alert-border-text-80)',
        alert_border_text_90: 'var(--alert-border-text-90)',
        alert_bg_60: 'var(--alert-bg-60)',
        alert_bg_70: 'var(--alert-bg-70)',
        alert_bg_80: 'var(--alert-bg-80)',
        alert_bg_90: 'var(--alert-bg-90)',
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
