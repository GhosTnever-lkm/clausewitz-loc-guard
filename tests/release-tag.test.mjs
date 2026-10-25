import test from 'node:test'
import assert from 'node:assert/strict'
import { validateReleaseTag } from '../scripts/validate-release-tag.mjs'

test('accepts the tag when it matches VERSION and package.json', () => {
  assert.equal(validateReleaseTag('v1.0.3', '1.0.3\n', '1.0.3'), '1.0.3')
})

test('rejects a tag that differs from VERSION', () => {
  assert.throws(() => validateReleaseTag('v1.0.4', '1.0.3', '1.0.3'), /does not match v1\.0\.3/)
})

test('rejects drift between VERSION and package.json', () => {
  assert.throws(() => validateReleaseTag('v1.0.3', '1.0.3', '1.0.2'), /does not match VERSION/)
})

test('rejects a missing VERSION value', () => {
  assert.throws(() => validateReleaseTag('v1.0.3', '  \n', '1.0.3'), /VERSION is empty/)
})
