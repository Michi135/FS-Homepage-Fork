import { randomBytes } from "crypto";

export default ({ env }) => ({
    // ...
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '1d',
        },
        jwtSecret: env("JWT_SECRET", randomBytes(16).toString('base64'))
      },
    },
    // ...
  });