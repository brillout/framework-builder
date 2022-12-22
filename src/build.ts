export { build }
export type { Options }
export { DIST }

import { build as tsup } from 'tsup'
import { fixAssetsDir, FRAMEWORK_BUILDER_ASSET_DIR } from './fixAssetsDir'
import assert from 'assert'
const DIST = './dist/'

type Options = {
  watch: boolean
  entries: string[]
}

async function build(options: Options) {
  await buildCode(options)
  await fixAssetsDir()
}

async function buildCode({ entries, watch }: Options) {
  assert(watch===false) // Doesn't work until esbuild implements https://github.com/evanw/esbuild/issues/2707 [Feature Request] New option `--assets-base`

  await tsup({
    watch,
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
