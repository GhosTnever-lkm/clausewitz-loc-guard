const test = require('node:test')
const assert = require('node:assert/strict')
const core = require('../core.js')

test('parses BOM, CRLF, escaped quotes, duplicates and malformed rows', () => {
  const parsed = core.parseLoc('\uFEFFl_english:\r\nKEY:0 "A \\\"quote\\\""\r\nKEY:0 "duplicate"\r\nbad row')
  assert.equal(parsed.headerRows[0].locale, 'english')
  assert.equal(parsed.entries.get('KEY').value, 'A \\"quote\\"')
  assert.deepEqual(parsed.duplicates.map((entry) => [entry.key, entry.line, entry.firstLine]), [['KEY', 3, 2]])
  assert.deepEqual(parsed.malformed.map((entry) => entry.line), [4])
})

test('recognises Clausewitz colour reset marker §!', () => {
  assert.deepEqual(core.extractTokens('§YWarning§!'), ['§!', '§Y'])
})

test('reports missing keys and token mismatches', () => {
  const base = { file: { name: 'base_l_english.yml' }, hasBom: true, parsed: core.parseLoc('l_english:\nA:0 "$NAME$ §Ytext§!"\nB:0 "unused"') }
  const target = { file: { name: 'target_l_french.yml' }, hasBom: true, parsed: core.parseLoc('l_french:\nA:0 "$NAME$ §Ytexte"') }
  const report = core.analyzeFiles(base, target, 'french')
  assert.equal(report.baseCount, 2)
  assert.equal(report.targetCount, 1)
  assert.ok(report.issues.some((issue) => issue.code === 'tokens' && issue.key === 'A'))
  assert.ok(report.issues.some((issue) => issue.code === 'missing' && issue.key === 'B'))
})

test('treats regex metacharacters in selected language as literal filename text', () => {
  const base = { file: { name: 'base_l_english.yml' }, hasBom: true, parsed: core.parseLoc('l_english:\nA:0 "Source"') }
  const target = { file: { name: 'target_l_en.yml' }, hasBom: true, parsed: core.parseLoc('l_en+:\nA:0 "Target"') }
  const report = core.analyzeFiles(base, target, 'en+')
  assert.ok(report.issues.some((issue) => issue.code === 'filename' && issue.params.expected === '_l_en+.yml'))
})
