/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0b1021',
        mint: '#41ead4',
        sand: '#f5f0ea',
        coral: '#ff6f61',
        sky: '#5dade2'
      },
      boxShadow: {
        card: '0 15px 50px rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
}
