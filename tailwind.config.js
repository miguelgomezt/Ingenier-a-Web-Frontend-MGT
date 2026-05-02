export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
      extend: {
        colors: {
          brand: {
            400: '#fb923c',
            500: '#f97316',
          },
          dark: {
            600: '#2e2e2e',
            700: '#242424',
            800: '#1a1a1a',
            900: '#0f0f0f',
          }
        },
        fontFamily: {
          display: ['Syne', 'sans-serif'],
          body: ['DM Sans', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }