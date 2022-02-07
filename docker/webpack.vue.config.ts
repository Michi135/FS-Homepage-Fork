import { resolve, join } from 'path'
import stripJsonComments from 'strip-json-comments'

import type { Configuration, Module } from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import nodeExternals from 'webpack-node-externals'
import svgToMiniDataURI from 'mini-svg-data-uri'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import CompressionPlugin, { ZlibOptions } from 'compression-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
//Not supported right now //import SpeedMeasurePlugin from 'speed-measure-webpack-plugin
import { TsConfig } from './tsConfigType'
import type { BrotliOptions } from 'zlib'
import { constants } from 'zlib'
import { VuetifyLoaderPlugin } from 'vuetify-loader'

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

const { readFileSync } = fsExtra;
const { DefinePlugin, HotModuleReplacementPlugin, NormalModuleReplacementPlugin, container } = webpack;

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

const configPath = resolve(fileURLToPath(import.meta.url), "..", "tsconfig.webpack.json");
const serverConfigPath = resolve(fileURLToPath(import.meta.url), "..", "tsconfig.json");
const tsConfigFile = readFileSync(configPath, { encoding: 'utf-8' });
const tsConfig = <TsConfig>JSON.parse(stripJsonComments(tsConfigFile));
const alias = tsConfig.compilerOptions.paths
const aliasBasePath = join(configPath, '..', tsConfig.compilerOptions.baseUrl);

let temp: Record<string, string[]> = {};

for (let [key, value] of Object.entries(alias)) {

  if (key.endsWith('/*'))
    key = key.substring(0, key.length - 2);

  temp[key] = [];
  value.forEach((value) => {
    if (value.endsWith('*'))
      value = value.substr(0, value.length - 1);

    temp[key].push(join(aliasBasePath, value));
  });
};

const config = (env: NodeJS.ProcessEnv = {}): Configuration => {
  const isProd = (env.mode === 'production');
  const isSSR = (env.rendering === 'ssr');
  const noMinimize = (env.minimize === 'false');
  const noBabel = (env.babel === 'false');
  const isServer = (env.target === 'server');

  const environment = isProd ? 'production' : 'development';
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
      loader: 'postcss-loader',
      /*options: {
        postcssOptions: {
          implementation: require("postcss"),
          config: resolve(__dirname, "postcss.config.cjs"),
        },
      },*/
    }
  ];

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [ ["env", {"modules": false} ]]
    }
  };

  const dirname = resolve();

  const genConfig = (isServerBuild: boolean = false): Configuration => {
    const minimize = isProd && !noMinimize && !isServerBuild
    const useBabel = isProd && !isServerBuild && !noBabel
    process.env.NODE_ENV = environment;
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
          type: (isServerBuild) ? 'module' : 'commonjs'
        },
        module: isServerBuild,
        filename: (isServerBuild) ? '[name].js' : (isProd) ? '[name].[contenthash].js' : '[name].js',
        publicPath: '/dist/',
        libraryTarget: isServerBuild ? 'module' : undefined,
        assetModuleFilename: (isProd) ? '[name].[contenthash][ext]' : '[name][ext]',
        chunkFilename: '[name].[chunkhash].js',
        clean: true,
        chunkFormat: isServerBuild ? 'module' : undefined,
      },
      experiments: {
        outputModule: isServerBuild,
      },
      externals: [
        isServerBuild ? nodeExternals(
          { 
            allowlist: [/\.(?!(?:jsx?|json|tsx?)$).{1,5}$/i],
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
            ],
            //exclude: /node_modules/,
          },
          {
            resourceQuery: /blockType=i18n/,
            type: 'javascript/auto',
            loader: '@intlify/vue-i18n-loader'
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
              dataUrlCondition: (source, { filename, module }) => {
                const size = svgToMiniDataURI(source.toString()).length * 8;
                return size < 8096;
              }
            },
            generator: {
              dataUrl: (content: string) => svgToMiniDataURI(content.toString()),
              emit: !isServerBuild
            }
          },
          {
            test: /\.css$/i,
            use: commonLoadersCSS,
          },
          {
            test: /\.less$/,
            use: [
              ...commonLoadersCSS,
              'less-loader',
            ],
          },
          {
            test: /\.tsx?$/,
            use: [
              ...(useBabel ? ['babel-loader'] : []),
              {
                loader: 'ts-loader',
                options:
                {
                  appendTsSuffixTo: [/\.vue$/],
                  transpileOnly: true,
                  configFile: (isServerBuild) ? serverConfigPath : configPath
                }
              },
            ],
            exclude: /node_modules/,
          },
          {
            test: /\.[mc]?jsx?$/,
            use: (useBabel) ? ['babel-loader'] : [],
            exclude: /node_modules/,
          },
          // target <docs> custom blocks
          /*{
            resourceQuery: /blockType=docs/,
            loader: require.resolve('./docs-loader'),
          },*/
        ],
      },
      cache: (!isProd) ?
        {
          type: 'memory',
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
        /*new container.ModuleFederationPlugin({
          shared: {
            'vue': {
              singleton: true,
              eager: true
            },
            '@vue/compiler-sfc': {
              singleton: true,
              eager: true
            },
            'vue-loader': {
              singleton: true,
              eager: true
            },
            'vue-router': {
              singleton: true,
              eager: true
            }
          }
        }),*/
        new VueLoaderPlugin(),
        new VuetifyLoaderPlugin(
          {
            //autoImport: true,
            //styles: "none"
          }),
        new MiniCssExtractPlugin({
          filename: (isProd) ? '[name].[contenthash].css' : '[name].css'
        }),
        new DefinePlugin({
          __IS_SSR__: isSSR,
          __IS_DEV__: !isProd,
          __IS_SERVER__: isServerBuild,
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
        }),
        //new LicenseWebpackPlugin({
        //}) as any,
      ],
      optimization: {
        runtimeChunk: (isServer) ? false : {
          name: 'runtime',
        },
        emitOnErrors: false,
        splitChunks: (isServerBuild) ?
          {
            cacheGroups: {
              main: {
                name: "main",
                chunks: "all",
                enforce: true
              }
            }
          } :
          {
            chunks: "all",
            cacheGroups: {
              commons: {
                name: "vendor",
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
          new CssMinimizerPlugin(),
        ]
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js', ".mjs", 'jsx', ".vue", ".json", ".wasm", ".cjs", ".svg"],
        alias: temp
      },
    }

    if (!isServerBuild) { //Allows usage of type-graphql decorated classes in browser
      /*config.plugins!.push(new NormalModuleReplacementPlugin(/type-graphql$/, resource => {
        resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim.js");
      }))*/
      config.plugins!.push(new HtmlWebpackPlugin({
        filename: 'test.html',
        template: resolve(dirname, 'src', 'index.html')
      }))
      config.plugins!.push(new WebpackManifestPlugin({}));
    }

    if (isProd) {
      if (!isServerBuild) {

        config.optimization!.minimizer!.push(new CompressionPlugin({
          test: /\.(jpg|txt|map|json|pdf|js|css|html|svg|png)$/,
          threshold: 8192,
        }))
        config.optimization!.minimizer!.push(new CompressionPlugin<BrotliOptions>({
          filename: "[path][base].br",
          algorithm: "brotliCompress",
          test: /\.(jpg|txt|map|json|pdf|js|css|html|svg|png)$/,
          compressionOptions: {
            params: {
              [constants.BROTLI_PARAM_QUALITY]: 11,
            },
          },
          threshold: 8192,
          minRatio: 0.8,
        }))
      }
    }
    else {
      config.plugins!.push(new HotModuleReplacementPlugin());
    }
    return config;
  }
  return genConfig(isServer)
}

export default config;