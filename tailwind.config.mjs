/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        lagoon: '#B8614A',
        lagoonDeep: '#8D4537',
        marigold: '#91A487',
        ink: '#3E302B',
        shell: '#F5E9D7',
        terracotta: '#B8614A',
        sage: '#91A487',
        almond: '#F5E9D7',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['Manrope', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        float: '0 24px 70px rgba(4, 60, 72, 0.22)',
      },
    },
  },
  plugins: [],
};
