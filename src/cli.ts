import { build, type Options } from './build'
import { assertUsage, getJsonFile } from './utils'

cli()

async function cli() {
  process.stdout.write('Buidling framework...')
  const options = getOptions()
  await build(options)
  process.stdout.write(' Done.\n')
}

function getOptions(): Options {
  const content = getJsonFile(
    'framework-builder.json',
    (cwd: string) =>
      `The current directory ${cwd} doesn't have a framework-builder.json file. Either create ${cwd}/framework-builder.json or run \`$ framework-builder\` at the directory of your framework-builder.json file.`
  )
  const { entries } = content
  assertUsage(entries, 'Missing framework-builder.json#entries')
  assertUsage(
    Array.isArray(entries) && entries.every((e) => typeof e === 'string'),
    'framework-builder.json#entries should a list of strings'
  )
  const options = { entries }
  return options
}
