module.exports = {
  content: ['./src/**/*.{vue, js, ts, jsx, tsx, less}', './node_modules/vuetify/**/*.{ts, vue, js, css}'],
  css: ['./src/**/*.less'],
  //defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
  //defaultExtractor: content => content.match(/[\w-/:.]+(?<!:)/g) || [],
  extractors: [
    {
      extractor: content =>
      {
        //contentWithoutStyleBlocks
        const cWSB = content.replace(/<style[^]+?<\/style>/gi, '')
        return [...cWSB.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g), ...cWSB.match(/[\w-/:.]+(?<!:)/g)] || []
      },
      extensions: ['vue']
    },
    {
      extractor: content =>
      {
        return [...content.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g), ...content.match(/[\w-/:.]+(?<!:)/g)] || []
      },
      extensions: ['less', 'css', 'js', 'ts', 'jsx', 'tsx']
    }
  ],
  safelist: {
    standard: [/-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /v-icon--size-.*/],
    greedy: [/data-v-.*/],
    deep: [/^v-.*/]
  }
  //rejected: true,
  //stdout: true
}