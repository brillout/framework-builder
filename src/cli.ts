import { build, type Options } from './build'
import { assertUsage, getJsonFile } from './utils'

process.on('unhandledRejection', onRejection)

cli()

async function cli() {
  console.log('Building framework...')
  const options = getOptions()
  await build(options)
  console.log('Done.')
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

  const { watch } = getCliArgs()

  const options = { entries, watch }
  return options
}

function getCliArgs() {
  const args = process.argv.slice(2)
  const watch = args.includes('--watch')
  return { watch }
}

function onRejection(rejectValue: unknown) {
  console.error(rejectValue)
}
