import { readJson, readJSON, writeJSON } from 'fs-extra'
import { resolve, join } from 'path'

(async () => {
    const syncPath = resolve('./', 'node_modules', 'vuex-router-sync');
    const packagePath = join(syncPath, 'package.json');
    const packageFile = await readJSON(packagePath, { encoding: 'UTF-8' });

    const main = packageFile["main"];

    if (main === "dist/vuex-router-sync.js") {
        packageFile["main"] = "dist/vuex-router-sync.cjs.js"
        await writeJSON(packagePath, packageFile);
    }
})()