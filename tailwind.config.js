const themeColors = {
  bg1: 'var(--bg-1)',
  bg2: 'var(--bg-2)',
  bg3: 'var(--bg-3)',
  bg4: 'var(--bg-4)',
  fg1: 'var(--fg-1)',
  fg2: 'var(--fg-2)',
  fg3: 'var(--fg-3)',
  fg4: 'var(--fg-4)',
}

module.exports = {
  theme: {
    colors: {
      primary: 'var(--primary)',
      ...themeColors,
    },
    backgroundColor: {
      primary: 'var(--primary)',
      ...themeColors,
    },
    borderColor: {
      DEFAULT: 'var(--bg-4)',
      primary: 'var(--primary)',
      ...themeColors,
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
