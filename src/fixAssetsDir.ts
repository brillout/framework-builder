export { fixAssetsDir }
export { FRAMEWORK_BUILDER_ASSET_DIR }

import { crawlAllFiles } from './utils'
import path from 'path'
import { promises as fsp } from 'fs'
import assert from 'assert'
const FRAMEWORK_BUILDER_ASSET_DIR = 'FRAMEWORK_BUILDER_ASSET_DIR/'
import { DIST } from './build'

// Workaround for https://github.com/evanw/esbuild/issues/2707 [Feature Request] New option `--assets-base`
async function fixAssetsDir() {
  const cwd = process.cwd()
  const distDir = path.join(cwd, DIST)
  const distFiles = await crawlAllFiles(distDir)
  await Promise.all(
    distFiles.map(async (filePath) => {
      let fileContent = await fsp.readFile(filePath, 'utf8')

      if (!fileContent.includes(FRAMEWORK_BUILDER_ASSET_DIR)) return

      // Absolute imports with `/assets/` base
      {
        assert(FRAMEWORK_BUILDER_ASSET_DIR.endsWith('/'))
        // Asset imports from JavaScript
        fileContent = fileContent.split(`= "${FRAMEWORK_BUILDER_ASSET_DIR}`).join(`= "/assets/`)
      }

      // Relative imports
      {
        let pathToDistRoot = path.relative(path.dirname(filePath), distDir)
        if (pathToDistRoot === '') {
          pathToDistRoot = '.'
        }
        assert(pathToDistRoot.startsWith('.') && !pathToDistRoot.endsWith('/'), pathToDistRoot)
        // JavaScript imports
        fileContent = fileContent.split(`from "${FRAMEWORK_BUILDER_ASSET_DIR}`).join(`from "${pathToDistRoot}/`)
        fileContent = fileContent.split(`import "${FRAMEWORK_BUILDER_ASSET_DIR}`).join(`import "${pathToDistRoot}/`)
        fileContent = fileContent.split(`import("${FRAMEWORK_BUILDER_ASSET_DIR}`).join(`import("${pathToDistRoot}/`)
        // Asset imports from CSS
        fileContent = fileContent.split(`url(${FRAMEWORK_BUILDER_ASSET_DIR}`).join(`url(${pathToDistRoot}/`)
      }

      assert(!fileContent.includes(FRAMEWORK_BUILDER_ASSET_DIR))

      await fsp.writeFile(filePath, fileContent, 'utf8')
    })
  )
}
