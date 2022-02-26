export default {}

export const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
}


export const getLessLoader = (isProduction: boolean) => {
  return {
    loader: 'less-loader',
    options: {
      sourceMap: !isProduction,
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  }
}
