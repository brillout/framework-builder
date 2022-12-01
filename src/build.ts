export { build }
export type { Options }

import { build as tsup } from 'tsup'
import { fixAssetsDir, FRAMEWORK_BUILDER_ASSET_DIR } from './fixAssetsDir'

type Options = {
  entries: string[]
}

async function build({ entries }: Options) {
  await tsup({
    config: false,
    silent: true,
    entry: entries,
    format: 'esm',
    clean: true,
    sourcemap: true,
    esbuildOptions(options, _context) {
      options.publicPath = FRAMEWORK_BUILDER_ASSET_DIR
    }
  })
  await fixAssetsDir()
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
