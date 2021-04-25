import { readJson, readJSON, writeJSON, pathExists, remove } from 'fs-extra'
import { resolve, join } from 'path'

const node_module_path = resolve('./', 'node_modules');

(async () => {
    const syncPath = resolve(node_module_path, 'vuex-router-sync');
    const packagePath = join(syncPath, 'package.json');
    const packageFile = await readJSON(packagePath, { encoding: 'UTF-8' });

    const main = packageFile["main"];

    if (main === "dist/vuex-router-sync.js") {
        packageFile["main"] = "dist/vuex-router-sync.cjs.js"
        await writeJSON(packagePath, packageFile);
    }
})();

const legacyWebpackTypeUsers = ["webpack-dev-middleware", "webpack-hot-middleware", "webpack-node-externals", "webpack-manifest-plugin", "compression-webpack-plugin"];

(async () => {
    for (let i = 0; i < legacyWebpackTypeUsers.length; ++i) {
        const user = legacyWebpackTypeUsers[i];
        const path = resolve(node_module_path, '@types', user, 'node_modules', '@types', 'webpack');

        if (await pathExists(path))
            await remove(path)
    }
})()