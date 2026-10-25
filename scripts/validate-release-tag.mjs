import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export function validateReleaseTag(tag, versionFile, packageVersion) {
  const version = String(versionFile).trim()
  if (!version) throw new Error('VERSION is empty')
  if (packageVersion !== version) {
    throw new Error(`package.json version ${packageVersion} does not match VERSION ${version}`)
  }
  if (tag !== `v${version}`) {
    throw new Error(`release tag ${tag} does not match v${version}`)
  }
  return version
}

function main() {
  try {
    const tag = process.argv[2]
    if (!tag) throw new Error('Pass the release tag as the first argument')
    const versionFile = readFileSync('VERSION', 'utf8')
    const packageVersion = JSON.parse(readFileSync('package.json', 'utf8')).version
    validateReleaseTag(tag, versionFile, packageVersion)
    console.log(`Release tag ${tag} matches VERSION and package.json`)
  } catch (error) {
    console.error(`::error::${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main()
