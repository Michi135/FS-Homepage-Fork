const postcssImport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = (api) => {
    return {
        plugins: [
            postcssImport(),
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