import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'off_white': '#eeeeee',
        'off_black': '#1d1e2c',
        'primary': '#b91c1c',
        'primary_hover': '#dc2626',
        'primary_click': '#7f1d1d',
      }
    }
  }
};
export default config;
