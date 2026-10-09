(() => {
  'use strict'

  function extractTokens(value) {
    const patterns = [
      /\$[^$\r\n]{1,100}\$/g,
      /§[A-Za-z0-9!]/g,
      /£[A-Za-z0-9_]+/g,
      /\[[A-Za-z0-9_.:-]+\]/g,
      /%%|%[1-9$sdiuf]/g,
      /\\[nrt"\\]/g,
    ]
    const tokens = []
    for (const pattern of patterns) tokens.push(...(value.match(pattern) || []))
    return tokens.sort()
  }

  function tokenSummary(value) {
    const counts = new Map()
    for (const token of extractTokens(value)) counts.set(token, (counts.get(token) || 0) + 1)
    return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([token, count]) => `${token}${count > 1 ? ` ×${count}` : ''}`)
  }

  function parseLoc(text) {
    const lines = text.replace(/^\uFEFF/, '').split(/\r\n|\n|\r/)
    const entries = new Map()
    const duplicates = []
    const malformed = []
    const headerRows = []
    const entryPattern = /^\s*([A-Za-z0-9_.\-']+)\s*:\s*(?:\d+\s*)?"((?:\\.|[^"\\])*)"\s*(?:#.*)?$/
    for (let index = 0; index < lines.length; index++) {
      const raw = lines[index]
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      const header = line.match(/^(l_[A-Za-z0-9_]+)\s*:\s*(?:#.*)?$/)
      if (header) { headerRows.push({ locale: header[1].slice(2), line: index + 1 }); continue }
      const match = raw.match(entryPattern)
      if (match) {
        const key = match[1]
        const entry = { key, value: match[2], line: index + 1 }
        if (entries.has(key)) duplicates.push({ ...entry, firstLine: entries.get(key).line })
        else entries.set(key, entry)
        continue
      }
      malformed.push({ line: index + 1, content: raw.slice(0, 220) })
    }
    return { entries, duplicates, malformed, headerRows, lines }
  }

  function addIssue(list, category, severity, code, key, line, params = {}) {
    list.push({ category, severity, code, key, line, params })
  }

  function analyzeFiles(base, target, language) {
    const issues = []
    const baseLocale = base.parsed.headerRows[0]?.locale || ''
    const targetLocale = target.parsed.headerRows[0]?.locale || ''
    if (base.parsed.entries.size === 0) addIssue(issues, 'format', 'error', 'noKeys', '', 1)
    if (target.parsed.entries.size === 0) addIssue(issues, 'format', 'error', 'noKeys', '', 1)
    const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    for (const [role, loaded, expected] of [['base', base, baseLocale], ['target', target, language]]) {
      if (!loaded.hasBom) addIssue(issues, 'format', 'warning', 'bom', '', 1, { role })
      const firstMeaningful = loaded.parsed.lines.find((line) => line.trim() && !line.trim().startsWith('#'))?.trim() || ''
      const detected = firstMeaningful.match(/^l_([A-Za-z0-9_]+)\s*:/)?.[1] || ''
      if (!detected) addIssue(issues, 'format', 'error', 'header', '', 1, { found: 'none', expected: expected ? `l_${expected}` : 'a language header' })
      else if (expected && detected !== expected) addIssue(issues, 'format', 'error', 'header', '', 1, { found: `l_${detected}`, expected: `l_${expected}` })
      const suffix = `_l_${expected}.yml`
      if (expected && !new RegExp(`_l_${escapeRegExp(expected)}\\.ya?ml$`, 'i').test(loaded.file.name)) addIssue(issues, 'format', 'info', 'filename', '', 1, { expected: suffix })
      for (const entry of loaded.parsed.duplicates) addIssue(issues, 'format', 'error', 'duplicate', entry.key, entry.line, { firstLine: entry.firstLine, role })
      for (const row of loaded.parsed.malformed) addIssue(issues, 'format', 'error', 'malformed', '', row.line, { role, content: row.content })
    }
    for (const [key, entry] of base.parsed.entries) {
      const translation = target.parsed.entries.get(key)
      if (!translation) {
        addIssue(issues, 'missing', 'warning', 'missing', key, entry.line)
        continue
      }
      const sourceTokens = tokenSummary(entry.value)
      const translatedTokens = tokenSummary(translation.value)
      if (JSON.stringify(sourceTokens) !== JSON.stringify(translatedTokens)) addIssue(issues, 'tokens', 'error', 'tokens', key, translation.line, { base: sourceTokens.join(' ') || '—', target: translatedTokens.join(' ') || '—' })
    }
    for (const [key, entry] of target.parsed.entries) if (!base.parsed.entries.has(key)) addIssue(issues, 'extra', 'info', 'extra', key, entry.line)
    return { issues, baseCount: base.parsed.entries.size, targetCount: target.parsed.entries.size, baseLocale, targetLocale, language, base, target }
  }

  const api = Object.freeze({ extractTokens, tokenSummary, parseLoc, analyzeFiles })
  if (typeof module !== 'undefined' && module.exports) module.exports = api
  else globalThis.ModLocaleCore = api
})()
