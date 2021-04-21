import 'dotenv/config'
import express, { json } from 'express'
import { createServer } from 'http'
import process from 'process'

import helmet from 'helmet'
import cors from 'cors'

import { Build } from '@shared/runtimeConfig'

const isDev = (process.env.NODE_ENV || 'development') === 'development';
const server = express();

//https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#token-sidejacking

function cleanExit(...cleanups: Function[]) {
  console.log("Gracefully shutting down");
  for (let i = 0; i < cleanups.length; ++i)
    (cleanups[i])();

  console.log("Goodbye");
  process.exit();
};

//add forbiden/authenticated routes

(async () => {
  try {

    const build = new Build(isDev).build();

    server.use(json());
    server.use(cors(
      {
        origin: 'https://fsmpi.uni-bayreuth.de:3000'
      })
    )
    server.use(helmet({ contentSecurityPolicy: false }));
    server.use('/robots.txt', (req, res) => {
      return res.status(200).send(`User-agent: AdsBot-Google
    Disallow: /`);
    })

    const httpServer = createServer(server);
    httpServer.listen(3000, 'fsmpi.uni-bayreuth.de');
    console.log("Listening")

    const exitHandler = () => {
      cleanExit(
        () => { httpServer.close() }
      )
    }
    process.on('SIGINT', exitHandler);
    process.on('SIGTERM', exitHandler)


    server.use(await build);

  } catch (reason) {
    console.log("Critical error " + reason)
    cleanExit();
  }
})()