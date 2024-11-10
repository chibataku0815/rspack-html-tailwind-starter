/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0f0f0f',
        'text-white': '#ffffff',
      },
      fontFamily: {
        'montreal': ['"PP Neue Montreal"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
