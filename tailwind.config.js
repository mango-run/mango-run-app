module.exports = {
  theme: {
    colors: {
      primary: 'var(--primary-color)',
    },
    backgroundColor: {
      primary: 'var(--primary-color)',
      1: 'var(--bg-1)',
      2: 'var(--bg-2)',
      3: 'var(--bg-3)',
      4: 'var(--bg-4)',
    },
    borderColor: {
      primary: 'var(--primary-color)',
    },
    borderRadius: {
      DEFAULT: '4px',
      sm: '2px',
      lg: '8px',
      full: '999999px',
    },
    boxShadow: {},
  },
  variants: {},
  plugins: [],
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
}
