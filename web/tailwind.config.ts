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
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      borderColor: {
        input: '#DEDEDE',
      },
    },
  },
  plugins: [],
}
export default config
