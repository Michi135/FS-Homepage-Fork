export default ({env}) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'img-src': ["'self'", 'data:', 'blob:', env('S3_ENDPOINT'), 'https://fsmpi.uni-bayreuth.de'],
          'media-src': ["'self'", 'data:', 'blob:', env('S3_ENDPOINT'), 'https://fsmpi.uni-bayreuth.de'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  /*{
    name: 'strapi::cors',
    config: {
      origin: '*'
    }
  },*/
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',	
  {
    name: 'strapi::public',
    config: {
      defaultIndex: false
    },
  },
];
