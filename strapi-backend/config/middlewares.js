module.exports = ({env}) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'img-src': ["'self'", 'data:', 'blob:', env('S3_ENDPOINT')],
          'media-src': ["'self'", 'data:', 'blob:', env('S3_ENDPOINT')],
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
  'strapi::public',
];
