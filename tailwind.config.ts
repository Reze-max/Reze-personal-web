import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        ink: '#1d1d1f',
        muted: '#86868b',
        line: '#d2d2d7',
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
      },
      maxWidth: {
        content: '980px',
      },
    },
  },
  plugins: [],
};

export default config;
