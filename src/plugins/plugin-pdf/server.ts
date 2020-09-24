import { addFilter } from "@factor/api"

const setup = (): void => {

  addFilter({
    hook: "webpack-loaders",
    key: "pdf-loader",
    callback: loaders => {

      loaders.push({
        test: /\.pdf$/,
        loader: 'file-loader',
        // esModule option introduced in v5, but breaks markdown-image-loader
        options: { name: "[name]-[hash:8].[ext]", esModule: false },
      })

      return loaders
    }
  })

  /*addFilter({
    hook: "package-webpack-config",
    key: "fuckkkk",
    callback: (config: Configuration, _arguments) => {
      let element: ExternalsElement =
      {
        'fs': 'commonjs2 fs'
      }
      config.externals = element

      return config
    }
  })*/
}

setup()