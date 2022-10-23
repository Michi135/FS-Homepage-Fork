declare global {
  namespace NodeJS {
    interface ProcessEnv extends Dict<string> {
      mode?: 'production' | 'development'
      target?: 'server' | 'client'
      rendering?: 'ssr' | 'csr'
      minimize?: 'false' | 'true'
      babel?: 'false' | 'true'
      JWT_SECRET_SHARED?: string
    }
  }

  var __IS_SSR__: boolean

  type SupportedLanguages = "de" | "en"
}

export { }