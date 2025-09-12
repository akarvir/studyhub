module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf5',
          100: '#d8f9e6',
          200: '#b2f1cd',
          300: '#80e2ad',
          400: '#4bcd8c',
          500: '#22c55e',
          600: '#16a34a',   // 👈 used in .btn
          700: '#15803d',   // 👈 used in .btn hover
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
