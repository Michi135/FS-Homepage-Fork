const postcssImport = require('postcss-import')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const nesting = require('tailwindcss/nesting')
const purgecss = require('@fullhuman/postcss-purgecss')
const preset = require('postcss-preset-env')
const purgeConfig = require('./purgecss.config.cjs')

module.exports = (api) =>
{
  return {
    plugins: [
      postcssImport(),
      nesting(),
      tailwindcss(),
      /*preset({
        stage: 1, features: {
          'focus-within-pseudo-class': false
        }
      }),*/
      autoprefixer()
      //purgecss({})
    ]
  }
}