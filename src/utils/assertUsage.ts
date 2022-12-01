export { assertUsage }

const wrongUsagePrefix = '[@brillout/framework-builder][Wrong Usage]'

function assertUsage(condition: unknown, errMsg: string): asserts condition {
  if (condition) return
  throw new Error(`${wrongUsagePrefix} ${errMsg}`)
}
