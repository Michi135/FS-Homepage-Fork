import { resolve, join, dirname } from 'path'
import stripJsonComments from 'strip-json-comments'
import svgToMiniDataURI from 'mini-svg-data-uri'
import { TsConfig } from './tsConfigType'
import type { BrotliOptions } from 'zlib'
import { constants } from 'zlib'
import glob from 'glob'

import type { AliasOptions, UserConfig } from 'vite'



import fsExtra from 'fs-extra'
const { readFile } = fsExtra

import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'
//import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import vuetify from 'vite-plugin-vuetify'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

type Options = {
  isProd: boolean
  isSSR: boolean
  noMinimize: boolean
  isServer: boolean
}

export async function configFunction(options: Partial<Options> = {}): Promise<UserConfig>
{
  const configRelative  = './tsconfig.vite.json'

  const dir = dirname(fileURLToPath(import.meta.url))
  const { isProd, isSSR, noMinimize, isServer } =
  {
    isProd: options.isProd || false,
    isSSR: options.isSSR || false,
    noMinimize: options.noMinimize || false,
    isServer: options.isServer || false
  }

  const environment = isProd ? 'production' : 'development'

  return {
    base: '/dist/',
    mode: environment,
    resolve: {
      extensions: ['.tsx', '.ts', '.js', ".mjs", 'jsx', ".vue", ".json", ".wasm", ".cjs", ".svg", '.jpg'],
      alias: {
        "@static": join(dir, "src/static")
        //vue: 'vue/dist/vue.esm-bundler.js'
        //'vue/server-renderer' : resolve(dir, "./node_modules/vue/server-renderer/index.js"),
        //'vue': resolve(dir, "./node_modules/vue/dist/vue.runtime.esm-bundler.js"),
        //'vue-i18n': resolve(dir, './node_modules/vue-i18n/dist/vue-i18n.runtime.esm-bundler.js')
      }
    },
    esbuild: {
      tsconfigRaw: await readFile(
        new URL(configRelative, import.meta.url),
        'utf-8'
      )
    },
    ssr: {
      noExternal: [/\.css$/, /\?vue&type=style/, /^vuetify/, /@vue\/apollo-composable/]
    },
    server: {
      cors: true
    },
    build: {
      manifest: true,
      ssrManifest: true,
      ssr: isSSR && isServer,
      outDir: resolve(
        isSSR ? (isServer ? 'dist-ssr/server' : 'dist-ssr/dist') : 'dist'
      ),
      rollupOptions: {
        output: {
          manualChunks: (id) =>
          {
            if (id.includes('node_modules/vuetify'))
            {
              return 'vendor_vuetify'
            }
            else if (id.includes('node_modules/@vue'))
            {
              return 'vendor_vue'
            }
            else if (id.includes('node_modules'))
            {
              return 'vendor_general'
            }
          },
          //esmodule:
          entryFileNames: (isServer) ? '[name].mjs' : (isProd) ? '[name].[hash].mjs' : '[name].mjs',
          chunkFileNames: `[name].[hash].mjs`
        },
        input: isServer
          ? resolve('src', 'shared', 'app.ts')
          : resolve('src', 'client', 'main.ts'),
        external(id, parent, isResolved)
        {
          if (isServer)
          {
            //console.log(id)
            //if (id.includes('node_modules'))
            {
              for (let k of [/\.(?!(?:jsx?|json|tsx?|mjs|c?js)$).{1,5}$/i, '@vue/apollo-composable', /vuetify\/lib\/.*$/i])
              {
                if (typeof k === 'string')
                {
                  if (id === k) return false
                }
                else if (k instanceof RegExp)
                {
                  if (id.match(k)) return false
                }
              }
              //return true
            }
            for (let k of [/^node:/])
            {
              if (typeof k === 'string')
              {
                if (id === k) return true
              }
              else if (k instanceof RegExp)
              {
                if (id.match(k)) return true
              }
            }
          }
          return false
        }
      }
    },
    plugins: [
      vue(),
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: resolve(dir, './src/shared/Translations/**')
      }),
      vuetify(),
      tsconfigPaths(
        {
          projects: [configRelative],
          //extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.jpg', '.css', '.vue', '.css', '.less'],
          loose: true
        })
    ],
    define: {
      __IS_SSR__: isSSR,
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_I18N_LEGACY_API__: false
    }
  }
}

const configure = defineConfig(async ({ command, mode, ssrBuild }) =>
{
  const { isProd, isSSR, isServer } = { isProd: true, isSSR: false, isServer: false }

  const environment = isProd ? 'production' : 'development'

  return await configFunction()
})

export default configure