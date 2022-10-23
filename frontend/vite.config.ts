import { resolve, join, dirname } from 'path'
import stripJsonComments from 'strip-json-comments'

import type { Configuration, Module } from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import nodeExternals from 'webpack-node-externals'
import svgToMiniDataURI from 'mini-svg-data-uri'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
//Not supported right now //import SpeedMeasurePlugin from 'speed-measure-webpack-plugin
import { TsConfig } from './tsConfigType'
import type { BrotliOptions } from 'zlib'
import { constants } from 'zlib'
import { VuetifyPlugin } from 'webpack-plugin-vuetify'
import PurgeCSSPlugin from 'purgecss-webpack-plugin'
import glob from 'glob'

import type { AliasOptions, UserConfig } from 'vite'



//import rollupResolve from '@rollup/plugin-node-resolve'
//import commonjs from '@rollup/plugin-commonjs'


/*import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import gifSicle from 'imagemin-gifsicle'
import jpegTran from 'imagemin-jpegtran'
import mozJpeg from 'imagemin-mozjpeg'
import optiPng from 'imagemin-optipng'
import pngQuant from 'imagemin-pngquant'
import svgo from 'imagemin-svgo'
import { extendDefaultPlugins } from 'svgo'*/

//further improvements https://medium.com/shard-labs/how-to-drastically-reduce-your-bundle-size-and-load-time-in-vue-js-54370d513fdf


import fsExtra from 'fs-extra'
import webpack from 'webpack'

const { readFileSync, readFile } = fsExtra
const { DefinePlugin, HotModuleReplacementPlugin, NormalModuleReplacementPlugin, container } = webpack

/**
 * Options object for DataUrl condition.
 */
declare interface AssetParserDataUrlOptions {
  /**
   * Maximum size of asset that should be inline as modules. Default: 8kb.
   */
  maxSize?: number;
}

/**
 * Parser options for asset modules.
 */
declare interface AssetParserOptions {
  /**
   * The condition for inlining the asset as DataUrl.
   */
  dataUrlCondition?:
  | AssetParserDataUrlOptions
  | ((
    source: string | Buffer,
    context: { filename: string; module: Module }
  ) => boolean);
}

import { fileURLToPath } from 'url'

const path = fileURLToPath(import.meta.url)

const configPath = resolve(path, "..", "tsconfig.webpack.json")
const serverConfigPath = resolve(path, "..", "tsconfig.json")
const tsConfigFile = readFileSync(configPath, { encoding: 'utf-8' })
const tsConfig = <TsConfig>JSON.parse(stripJsonComments(tsConfigFile))
const alias = tsConfig.compilerOptions.paths
const aliasBasePath = join(configPath, '..', tsConfig.compilerOptions.baseUrl)

let aliases: Record<string, string[] | string | false> = {}

for (let [key, value] of Object.entries(alias))
{

  if (key.endsWith('/*'))
    key = key.substring(0, key.length - 2)

  aliases[key] = []
  value.forEach((value) =>
  {
    if (value.endsWith('*'))
      value = value.substring(0, value.length - 1);

    (<string[]>aliases[key]).push(join(aliasBasePath, value))
  })
};

const config = (env: NodeJS.ProcessEnv = {}): Configuration =>
{
  const isProd = (env.mode === 'production')
  const isSSR = (env.rendering === 'ssr')
  const noMinimize = (env.minimize === 'false')
  const noBabel = (env.babel === 'false')
  const isServer = (env.target === 'server')

  const environment = isProd ? 'production' : 'development'
  /**
   * Some notes regarding config for the server build of an SSR app:
   * 1. target: 'node'
   * 2. output.libraryTarget: 'commonjs' (so the exported app can be required)
   */
  const commonLoadersCSS = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        emit: !isServer
      }
    },
    'css-loader',
    {
      loader: 'postcss-loader'
      /*options: {
        postcssOptions: {
          implementation: require("postcss"),
          config: resolve(__dirname, "postcss.config.cjs"),
        },
      },*/
    }
  ]

  if (isProd)
  {
    aliases['vue'] = "vue/dist/vue.runtime.esm-bundler.js"
    aliases['vue-i18n'] = 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
  }
  //aliases = { ...aliases, ...{ "vue": "vue/dist/vue.runtime.esm-bundler.js", 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js' } }
  if (!isServer)
  {
    //aliases['crypto'] = false
    //aliases['stream'] = 'stream-browserify'
  }

  const dirname = resolve()

  const genConfig = (isServerBuild: boolean = false): Configuration =>
  {
    const minimize = isProd && !noMinimize && !isServerBuild
    //const useBabel = isProd && !isServerBuild && !noBabel
    process.env.NODE_ENV = environment
    let config: Configuration = {
      mode: environment,
      entry: isServerBuild
        ? resolve(dirname, 'src', 'shared', 'app.ts')
        : [resolve(dirname, 'src', 'client', 'main.ts')].concat((!isProd) ? ['webpack-hot-middleware/client?reload=true?overlay=true'] : []),
      target: isServerBuild ? 'node' : 'web',
      devtool: (isServerBuild || isProd) ? false : 'source-map',
      output: {
        path: resolve(
          dirname,
          isSSR ? (isServerBuild ? 'dist-ssr/server' : 'dist-ssr/dist') : 'dist'
        ),
        environment: {
          module: isServerBuild
        },
        library: {
          type: 'module'
        },
        module: isServerBuild,
        filename: (isServerBuild) ? '[name].js' : (isProd) ? '[name].[contenthash].js' : '[name].js',
        publicPath: '/dist/',
        libraryTarget: isServerBuild ? 'module' : undefined,
        assetModuleFilename: (isProd) ? '[name].[contenthash][ext]' : '[name][ext]',
        chunkFilename: '[name].[chunkhash].js',
        clean: true,
        chunkFormat: isServerBuild ? 'module' : undefined
      },
      experiments: {
        outputModule: true
      },
      externals: [
        isServerBuild ? nodeExternals(
          {
            allowlist: [/\.(?!(?:jsx?|json|tsx?|mjs|cjs)$).{1,5}$/i, '@vue/apollo-composable', /vuetify\/lib\/.*$/i],
            //@ts-ignore
            importType: 'module'
          }) : {}
      ],
      externalsPresets: { node: isServerBuild },
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: [
              {
                loader: 'vue-loader',
                options: {
                  isServerBuild: isServerBuild,
                  hotReload: !isProd
                }
              }
            ]
            //exclude: /node_modules/,
          },
          {
            resourceQuery: /blockType=i18n/,
            type: 'javascript/auto',
            loader: '@intlify/vue-i18n-loader'
          },
          {
            test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
            type: 'javascript/auto',
            loader: '@intlify/vue-i18n-loader',
            include: [ // Use `Rule.include` to specify the files of locale messages to be pre-compiled
              resolve(dirname, 'src/shared/Translations/')
            ]
          },
          {
            test: /\.(png|jpe?g|gif|pdf)$/i,
            type: 'asset',
            parser: {
              dataUrlCondition: { maxSize: 8096 }
            },
            generator: {
              emit: !isServerBuild
            }
          },
          {
            test:
              /\.svg$/i,
            type: 'asset',
            parser: <AssetParserOptions>{
              dataUrlCondition: (source, { filename, module }) =>
              {
                const size = svgToMiniDataURI(source.toString()).length * 8
                return size < 8096
              }
            },
            generator: {
              dataUrl: (content: string) => svgToMiniDataURI(content.toString()),
              emit: !isServerBuild
            }
          },
          {
            test: /\.css$/i,
            use: commonLoadersCSS
          },
          {
            test: /\.less$/,
            use: [
              ...commonLoadersCSS,
              'less-loader'
            ]
          },
          {
            test: /\.tsx?$/,
            use: [
              ...(/*useBabel*/ true ? ['babel-loader'] : []),
              {
                loader: 'ts-loader',
                options:
                {
                  appendTsSuffixTo: [/\.vue$/],
                  transpileOnly: true,
                  configFile: (isServerBuild) ? serverConfigPath : configPath
                }
              }
            ],
            exclude: /node_modules/
          },
          {
            test: /\.[mc]?jsx?$/,
            use: (/*useBabel*/ true) ? ['babel-loader'] : [],
            exclude: /node_modules/
          }
          // target <docs> custom blocks
          /*{
            resourceQuery: /blockType=docs/,
            loader: require.resolve('./docs-loader'),
          },*/
        ]
      },
      cache: (!isProd) ?
        {
          type: 'memory'
          /*name: isServerBuild ? "server" : "client",
          buildDependencies: {
            // 2. Add your config as buildDependency to get cache invalidation on config change
            config: [__filename]

            // 3. If you have other things the build depends on you can add them here
            // Note that webpack, loaders and all modules referenced from your config are automatically added
          }*/
        } : false
      ,
      plugins: [ //@ts-ignore
        //new SpeedMeasurePlugin({ granularLoaderData: true }),
        new VueLoaderPlugin(),
        new VuetifyPlugin({}),
        new MiniCssExtractPlugin({
          filename: (isProd) ? '[name].[contenthash].css' : '[name].css'
        }),
        new DefinePlugin({
          __IS_SSR__: isSSR,
          __IS_DEV__: !isProd,
          __IS_SERVER__: isServerBuild,
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
          __VUE_I18N_LEGACY_API__: false,
          __BACKEND_BASE_URL__: ''
        })
        //new LicenseWebpackPlugin({
        //}) as any,
      ],
      optimization: {
        runtimeChunk: (isServer) ? false : {
          name: 'runtime'
        },
        emitOnErrors: false,
        concatenateModules: (isServer) ? true : undefined,
        splitChunks: (isServerBuild) ? false
          /*{
            cacheGroups: {
              main: {
                name: "main",
                chunks: "all",
                enforce: true
              }
            }
          }*/ :
          {
            chunks: "all",
            cacheGroups: {
              commons: {
                filename: 'vendors.[contenthash].js',
                test: /[\\/]node_modules[\\/]/,
                chunks: "initial",
                enforce: true
              }
            }
          }
        ,
        minimize: minimize,
        minimizer: [
          '...',
          new CssMinimizerPlugin()
        ]
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js', ".mjs", 'jsx', ".vue", ".json", ".wasm", ".cjs", ".svg"],
        alias: aliases //{ ...temp, (isProd) ? ...{ "vue": "vue/dist/vue.runtime.esm-bundler.js", 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js' } : ...{} }
      }
      //stats: (isServerBuild) ? 'normal' : 'verbose'
    }

    if (!isServerBuild)
    { //Allows usage of type-graphql decorated classes in browser
      /*config.plugins!.push(new NormalModuleReplacementPlugin(/type-graphql$/, resource => {
        resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim.js");
      }))*/
      config.plugins!.push(new HtmlWebpackPlugin({
        filename: 'test.html',
        template: resolve(dirname, 'src', 'index.html')
      }))
      config.plugins!.push(new WebpackManifestPlugin({}))
    }

    if (isProd)
    {
      if (!isServerBuild)
      {
        config.optimization!.minimizer!.push(new CompressionPlugin({
          test: /\.(jpg|txt|map|json|pdf|js|css|html|svg|png)$/,
          threshold: 8192
        }))
        config.optimization!.minimizer!.push(new CompressionPlugin<BrotliOptions>({
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          test: /\.(jpg|txt|map|json|pdf|js|css|html|svg|png)$/,
          compressionOptions: {
            params: {
              [constants.BROTLI_PARAM_QUALITY]: 11
            }
          },
          threshold: 8192,
          minRatio: 0.8
        })),
        config.plugins!.push(new PurgeCSSPlugin(
          {
            paths: () => [...glob.sync(`./src/**/*`,  { nodir: true }), ...glob.sync(`./node_modules/vuetify/**/*`,  { nodir: true })],
            defaultExtractor: content => content.match(/([A-Za-z0-9-_:\/]|[0-9\.0-9])+/g) || [],
            blocklist: ["./src/static/index.html"],
            safelist: [/-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/, /v-icon--size-.*/]
          }))
      }
    }
    else
    {
      config.plugins!.push(new HotModuleReplacementPlugin())
    }
    return config
  }
  return genConfig(isServer)
}

//export default config

import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import vuetify from 'vite-plugin-vuetify'
import tsconfigPaths from 'vite-tsconfig-paths'

type Options = {
  isProd: boolean
  isSSR: boolean
  noMinimize: boolean
  isServer: boolean
}

async function configFunction(options: Partial<Options> = {}): Promise<UserConfig>
{
  const finalOptions: Options =
  {
    isProd: options.isProd || false,
    isSSR: options.isSSR || false,
    noMinimize: options.noMinimize || false,
    isServer: options.isServer || false
  }

  const config = async (): Promise<UserConfig> =>
  {
    //const { env } = process
    /*
    const isProd = (env.mode === 'production')
    const isSSR = (env.rendering === 'ssr') || true
    const noMinimize = (env.minimize === 'false')
    const noBabel = (env.babel === 'false')
    const isServer = (env.target === 'server')
    */

    const { isProd, isSSR, isServer } = finalOptions

    const environment = isProd ? 'production' : 'development'

    const dir = dirname(fileURLToPath(import.meta.url))

    return {
      base: '/dist/',
      mode: environment,
      resolve: {
        extensions: ['.tsx', '.ts', '.js', ".mjs", 'jsx', ".vue", ".json", ".wasm", ".cjs", ".svg", '.jpg'],
        alias: {
          "@static": join(dir, "src/static"),
          vue: 'vue/dist/vue.esm-bundler.js'
          //'vue/server-renderer' : resolve(dir, "./node_modules/vue/server-renderer/index.js"),
          //'vue': resolve(dir, "./node_modules/vue/dist/vue.runtime.esm-bundler.js"),
          //'vue-i18n': resolve(dir, './node_modules/vue-i18n/dist/vue-i18n.runtime.esm-bundler.js')
        }
      },
      esbuild: {
        tsconfigRaw: await readFile(
          new URL('./tsconfig.webpack.json', import.meta.url),
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
        /*lib: {
          entry: isServer
            ? resolve('src', 'shared', 'app.ts')
            : resolve('src', 'client', 'main.ts')
        },*/
        //filename: (isServer) ? '[name].mjs' : (isProd) ? '[name].[hash].mjs' : '[name].mjs',
        rollupOptions: {
          /*plugins: [
            aliasRollup({
              entries: [
                { find: /@static\/(.*)/, replacement: resolve(dir, './src/static/$1') }
              ],
            })
          ],*/
          output: {
            manualChunks: (id) =>
            {
              if (id.includes('node_modules'))
              {
                return 'vendor'
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
            projects: ['./tsconfig.webpack.json'],
            //extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.jpg', '.css', '.vue', '.css', '.less'],
            loose: true
          })
      ],
      define: {
        __IS_SSR__: isSSR,
        __IS_DEV__: !isProd,
        __IS_SERVER__: isServer,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_I18N_LEGACY_API__: false
      }
    }
  }

  return await config()
}

export default configFunction