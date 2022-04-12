module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '458d6a0562887d702742619e02346abb'),
  },
  port: 7000,
  host: 'localhost',
  url: 'http://apps.fsmpi'
});
