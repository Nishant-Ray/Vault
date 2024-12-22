import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'off_white': '#f3f4f6',
        'off_black': '#25264F',
        'off_gray': '#6b7280',
        'primary': '#b91c1c',
        'primary_hover': '#dc2626',
        'primary_click': '#7f1d1d',
        'positive': '#eaf7f0',
        'positive_text': '#2baa63',
        'negative': '#fdeded',
        'negative_text': '#eb605e',
        'accent': '#3da8e6'
      }
    }
  }
};
export default config;
