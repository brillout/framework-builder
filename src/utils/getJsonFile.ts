export { getJsonFile }

import { isObject } from './isObject'
import path from 'path'
import fs from 'fs'
import assert from 'assert'
import { assertUsage } from './assertUsage'

function getJsonFile(filename: string, errMsg: (cwd: string) => string): Record<string, unknown> {
  let fileContent: string
  const cwd = process.cwd()
  const filePath = path.join(cwd, `./${filename}`)
  try {
    fileContent = fs.readFileSync(filePath, 'utf8')
  } catch {
    assertUsage(false, errMsg(cwd))
  }
  const content = JSON.parse(fileContent)
  assert(isObject(content))
  return content
}
