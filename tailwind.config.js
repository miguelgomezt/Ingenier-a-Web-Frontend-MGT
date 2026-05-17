export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          600: '#374151',
          700: '#1f2937',
          800: '#111827',
          900: '#0f172a',
        },
        brand: {
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
        },
        gray: {
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      }
    },
  },
  plugins: [],
}