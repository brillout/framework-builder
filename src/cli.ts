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
  const options = { entries }
  return options
}

function onRejection(rejectValue: unknown) {
  console.error(rejectValue)
  /* We don't `process.exit(1)` in order to avoid:
   ````shell
   FATAL ERROR: v8::FromJust Maybe value is Nothing.
    1: 0xb57b90 node::Abort() [node]
    2: 0xa701b3 node::FatalError(char const*, char const*) [node]
    3: 0xd4388a v8::Utils::ReportApiFailure(char const*, char const*) [node]
    4: 0xb5bfed node::fs::FileHandle::CloseReq::Resolve() [node]
    5: 0xb5c170  [node]
    6: 0x1634dbd  [node]
    7: 0x1639596  [node]
    8: 0x164bcd4  [node]
    9: 0x1639ee8 uv_run [node]
   10: 0xa95e45 node::SpinEventLoop(node::Environment*) [node]
   11: 0xc22472 node::worker::Worker::Run() [node]
   12: 0xc22a58  [node]
   13: 0x7b9e873a1fa3  [/lib/x86_64-linux-gnu/libpthread.so.0]
   14: 0x7b9e872d306f clone [/lib/x86_64-linux-gnu/libc.so.6]
   Aborted (core dumped)
   ```
  process.exit(1)
  */
}
