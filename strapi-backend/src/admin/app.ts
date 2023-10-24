export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    translations: {
      de: {
        'Physik': 'Physik',
        'anzeigeName': 'Anzeigename',
        'grad': 'Grad',
        'feld': 'Feld',
        'semester': 'Semester',
        'portrait': 'Portrait',
        'hauptfach': 'Hauptfach'
      }
    }
  },
  //@ts-ignore
  bootstrap(app) {
    console.log(app);
  },
};