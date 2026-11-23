/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { colors: { ink: '#172554', brand: '#3157D5', mist: '#F4F6FB' }, fontFamily: { sans: ['DM Sans','sans-serif'], display: ['Manrope','sans-serif'] }, boxShadow: { soft: '0 8px 30px rgba(20,35,90,.06)' } } },
  plugins: [],
}
