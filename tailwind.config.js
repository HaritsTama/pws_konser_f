/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'grotesk': ['"Space Grotesk"', 'monospace'],
      },
      colors: {
        'paper': '#F5F1E8',
        'ink': '#1A1A1A',
        'stamp-red': '#D32F2F',
        'perforation': '#8B7355',
      },
    },
  },
  plugins: [],
}