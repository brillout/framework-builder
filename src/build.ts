export { build }
export type { Options }
export { DIST }

import { build as tsup } from 'tsup'
import { fixAssetsDir, FRAMEWORK_BUILDER_ASSET_DIR } from './fixAssetsDir'
const DIST = './dist/'

type Options = {
  entries: string[]
}

async function build(options: Options) {
  await buildCode(options)
  await fixAssetsDir()
}

async function buildCode({ entries }: Options) {
  await tsup({
    config: false,
    outDir: DIST,
    silent: true,
    entry: entries,
    format: 'esm',
    clean: true,
    sourcemap: true,
    dts: true,
    esbuildOptions(options) {
      options.publicPath = FRAMEWORK_BUILDER_ASSET_DIR
    }
  })
}

/*
function getPackageJson(): Record<string, unknown> {
  const content = getJsonFile(
    'framework-builder.json',
    (cwd: string) =>
      `The current directory ${cwd} doesn't seem to be the root directory of you project. Make sure to run \`$ framework-builder\` at your project's root directory.`
  )
  return content
}
*/
