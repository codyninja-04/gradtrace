import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // App chrome
        canvas: '#F9FAFB',
        surface: '#FFFFFF',
        line: '#E5E7EB',
        ink: '#111827',
        muted: '#6B7280',
        // Primary action
        primary: '#2563EB',
        // Match label colours, kept in sync with lib/types.ts match_label
        'apply-now': '#166534',
        'worth-applying': '#16A34A',
        stretch: '#D97706',
        'not-recommended': '#6B7280',
      },
      backgroundImage: {
        'score-bar': 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
