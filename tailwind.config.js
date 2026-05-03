export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
      extend: {
        colors: {
          dark: {
            600: '#374151', // gris oscuro
            700: '#1f2937',
            800: '#111827',
          },
          brand: {
            500: '#f97316', // naranja (ajústalo si quieres)
          }
        },
      },
    },
    plugins: [],
  }