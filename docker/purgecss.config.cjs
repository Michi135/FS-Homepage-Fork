module.exports = {
  content: [`./src/**/*.vue`, `./src/**/*.ts`, `./src/**/*.js`],
  css: [`./src/**/*.less`],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  extractors: [
    {
      extractor: content =>
      {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?>/gi, '').replace(/<\/style>/, '')
        console.log(contentWithoutStyleBlocks)
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
      },
      extensions: ['vue']
    }
  ],
  safelist: [/-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/],
  rejected: true,
  stdout: true
}