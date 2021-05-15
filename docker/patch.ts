import { pathExists, remove } from 'fs-extra'
import { resolve } from 'path'

const node_module_path = resolve('./', 'node_modules');

const legacyWebpackTypeUsers = ["webpack-hot-middleware", "webpack-node-externals", "webpack-manifest-plugin", "compression-webpack-plugin"];

(async () => {
    for (let i = 0; i < legacyWebpackTypeUsers.length; ++i) {
        const user = legacyWebpackTypeUsers[i];
        const path = resolve(node_module_path, '@types', user, 'node_modules', '@types', 'webpack');

        if (await pathExists(path))
            await remove(path)
    }
})()