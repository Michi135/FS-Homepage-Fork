const postcssImport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const nesting = require('tailwindcss/nesting');
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = (api) => {
    return {
        plugins: [
            postcssImport(),
            nesting(),
            tailwindcss(),
            /*require('postcss-preset-env')({
                stage: 1, features: {
                    'focus-within-pseudo-class': false
                }
            }),*/
            autoprefixer(),
        ],
    }
}