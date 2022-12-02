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
    dts: true,
    esbuildOptions(options) {
      options.publicPath = FRAMEWORK_BUILDER_ASSET_DIR
    }
  })
}
