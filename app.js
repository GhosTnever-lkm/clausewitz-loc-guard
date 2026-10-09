(() => {
  'use strict'

  const core = window.ModLocaleCore
  const $ = (selector) => document.querySelector(selector)
  const ui = {
    baseInput: $('#base-file'), targetInput: $('#target-file'),
    baseDrop: $('#base-drop'), targetDrop: $('#target-drop'),
    baseMeta: $('#base-meta'), targetMeta: $('#target-meta'),
    analyze: $('#analyze-button'), errors: $('#error-message'), results: $('#results'),
    score: $('#score-strip'), issues: $('#issue-list'), empty: $('#empty-results'),
    lang: $('#target-language'), customLang: $('#custom-language'),
    langToggle: $('#language-toggle'), demo: $('#demo-button'),
  }
  const app = { baseFile: null, targetFile: null, report: null, tab: 'all', locale: 'ru' }
  const encoder = new TextEncoder()
  const translations = {
    ru: {
      eyebrow: 'БЕСПЛАТНО · РАБОТАЕТ ЛОКАЛЬНО · БЕЗ РЕГИСТРАЦИИ', heroTitle: 'Перевод готов.<br><span>Файл тоже?</span>',
      heroText: 'Найдите пропущенные ключи, неверный BOM и потерянные игровые переменные до запуска мода. Ваши файлы остаются на этом устройстве.',
      pointOne: 'Проверка за секунды', pointTwo: 'Никаких API и отправки файлов', chipDuplicate: 'Повторяющиеся ключи', chipSafe: 'Локально и безопасно',
      stepLabel: 'ПРОВЕРКА ФАЙЛОВ', workspaceTitle: 'Сравните два языка', demoButton: 'Загрузить пример', baseTitle: 'Исходный язык', baseHint: 'Например, английский файл',
      targetTitle: 'Перевод', targetHint: 'Файл, который нужно проверить', dropText: 'Перетащите файл сюда', orBrowse: 'или <u>выберите на устройстве</u>', noFile: 'Файл не выбран',
      targetLangLabel: 'Язык перевода', analyzeButton: 'Проверить локализацию', reportLabel: 'ОТЧЁТ', reportTitle: 'Результаты проверки', exportReport: 'Скачать отчёт', exportMissing: 'Скачать файл с пропусками',
      tabAll: 'Все', tabMissing: 'Пропущено', tabTokens: 'Токены', tabFormat: 'Формат', cleanTitle: 'Всё чисто', cleanText: 'Ошибок в выбранных проверках не найдено.',
      howLabel: 'ПОНЯТНО С ПЕРВОГО РАЗА', howTitle: 'Три проверки.<br><span>Меньше сюрпризов в игре.</span>',
      featureOneTitle: 'Покрытие ключей', featureOneText: 'Сравните перевод с оригиналом и найдите строки, которых не хватает или которые уже не используются.',
      featureTwoTitle: 'Переменные и формат', featureTwoText: 'Узнайте, если в переводе потерялись $TOKEN$, §Y, §! сброс форматирования, значок £ или другой игровой маркер.',
      featureThreeTitle: 'Кодировка и дубли', featureThreeText: 'Проверьте UTF-8 BOM, языковой заголовок, имя файла и повторяющиеся ключи.',
      privacyTitle: 'Файлы не покидают устройство', privacyText: 'Проверка выполняется прямо в браузере. Нет аккаунта, аналитики, API или загрузки на сервер. Скачивание исправленного файла начинается только по твоему нажатию.',
      privacyBadge: 'ЛОКАЛЬНАЯ ОБРАБОТКА', footerText: 'Создано для авторов модификаций · Открытый код · Бесплатно',
      countKeys: 'ключей', coverage: 'Покрытие перевода', missingMetric: 'Пропущено', tokensMetric: 'Токены', formatMetric: 'Формат',
      statusGood: 'В порядке', statusWarn: 'Есть замечания', statusBad: 'Требует исправления',
      missingTitle: 'Нет перевода для ключа', missingText: 'Ключ есть в исходном файле, но отсутствует в файле перевода.', extraTitle: 'Лишний ключ в переводе', extraText: 'Ключа нет в исходном файле. Проверь, не устарела ли строка.',
      duplicateTitle: 'Повторяющийся ключ', malformedTitle: 'Не удалось разобрать строку', malformedText: 'Ожидается строка вида KEY:0 "текст". Проверь двоеточие, кавычки и экранирование.',
      tokenTitle: 'Игровые маркеры отличаются', tokenText: 'В исходнике: {base}. В переводе: {target}. Сохрани переменные и управляющие символы.',
      bomTitle: 'Не найден UTF-8 BOM', bomText: 'Игра ожидает BOM в начале файла локализации. Экспортированный файл будет сохранён с BOM.',
      headerTitle: 'Не совпадает заголовок языка', headerText: 'Найдено {found}; выбранный язык — {expected}. Проверь первую строку и язык в списке.',
      filenameTitle: 'В имени файла нет языкового суффикса', filenameText: 'Для Paradox имя обычно заканчивается на _l_{language}.yml.',
      noKeysTitle: 'В файле не найдено строк локализации', noKeysText: 'Проверь формат и заголовок файла.',
      reportCreated: 'Отчёт создан', missingCreated: 'Файл с пропущенными ключами скачан', fileTooLarge: 'Файл слишком большой (лимит 20 МБ).',
      sameFile: 'Выбери два разных файла для сравнения.', loadError: 'Не удалось прочитать файл. Убедись, что это текстовый файл UTF-8.',
      pickLanguage: 'Введи код языка, например korean.', allClear: 'Ошибок не найдено.', detailsLine: 'Строка {line}',
      selectLanguage: 'Выбери язык перевода', duplicateAt: 'Ключ уже встречался выше (строка {line}).',
    },
    en: {
      eyebrow: 'FREE · LOCAL-FIRST · NO ACCOUNT', heroTitle: 'Translation done.<br><span>Is the file ready?</span>',
      heroText: 'Catch missing keys, invalid BOMs, and lost game tokens before launching your mod. Your files stay on this device.',
      pointOne: 'Checks in seconds', pointTwo: 'No API and no file uploads', chipDuplicate: 'Duplicate keys', chipSafe: 'Local and private',
      stepLabel: 'FILE CHECK', workspaceTitle: 'Compare two languages', demoButton: 'Load example', baseTitle: 'Source language', baseHint: 'For example, the English file',
      targetTitle: 'Translation', targetHint: 'The file you want to check', dropText: 'Drop a file here', orBrowse: 'or <u>browse your device</u>', noFile: 'No file selected',
      targetLangLabel: 'Translation language', analyzeButton: 'Check localisation', reportLabel: 'REPORT', reportTitle: 'Check results', exportReport: 'Download report', exportMissing: 'Download missing-key file',
      tabAll: 'All', tabMissing: 'Missing', tabTokens: 'Tokens', tabFormat: 'Format', cleanTitle: 'All clear', cleanText: 'No issues were found in the selected checks.',
      howLabel: 'CLEAR FROM THE START', howTitle: 'Three checks.<br><span>Fewer surprises in game.</span>',
      featureOneTitle: 'Key coverage', featureOneText: 'Compare a translation with its source and find missing or outdated strings.',
      featureTwoTitle: 'Tokens and formatting', featureTwoText: 'Spot dropped $TOKEN$, §Y, the §! formatting reset, £ icons, or other in-game markers.',
      featureThreeTitle: 'Encoding and duplicates', featureThreeText: 'Check UTF-8 BOM, language header, filename, and duplicate keys.',
      privacyTitle: 'Files stay on your device', privacyText: 'Checks run in your browser. No account, analytics, API, or server uploads. A file is downloaded only when you click a download button.',
      privacyBadge: 'LOCAL PROCESSING', footerText: 'Made for mod authors · Open source · Free',
      countKeys: 'keys', coverage: 'Translation coverage', missingMetric: 'Missing', tokensMetric: 'Tokens', formatMetric: 'Format',
      statusGood: 'Looks good', statusWarn: 'Needs review', statusBad: 'Needs fixes',
      missingTitle: 'Missing translation key', missingText: 'The key exists in the source file but is absent from the translation.', extraTitle: 'Extra translation key', extraText: 'The key is not in the source file. Check whether this entry is outdated.',
      duplicateTitle: 'Duplicate key', malformedTitle: 'Could not parse line', malformedText: 'Expected KEY:0 "text". Check the colon, quotes, and escaping.',
      tokenTitle: 'Game markers differ', tokenText: 'Source: {base}. Translation: {target}. Keep variables and control markers intact.',
      bomTitle: 'UTF-8 BOM is missing', bomText: 'The game expects a BOM at the start of localisation files. The exported file will include one.',
      headerTitle: 'Language header mismatch', headerText: 'Found {found}; selected language is {expected}. Check the first line and language selector.',
      filenameTitle: 'Language suffix missing from filename', filenameText: 'Paradox filenames usually end in _l_{language}.yml.',
      noKeysTitle: 'No localisation entries found', noKeysText: 'Check the file format and language header.',
      reportCreated: 'Report downloaded', missingCreated: 'Missing-key file downloaded', fileTooLarge: 'File is too large (20 MB limit).',
      sameFile: 'Choose two different files to compare.', loadError: 'Could not read this file. Make sure it is UTF-8 text.',
      pickLanguage: 'Enter a language code, for example korean.', allClear: 'No issues found.', detailsLine: 'Line {line}',
      selectLanguage: 'Choose a translation language', duplicateAt: 'This key already appeared above (line {line}).',
    },
  }
  const languageLocales = new Set(['english', 'russian', 'french', 'german', 'spanish', 'polish', 'braz_por', 'japanese', 'simp_chinese'])
  const languageDisplay = { english: 'English', russian: 'Russian', french: 'French', german: 'German', spanish: 'Spanish', polish: 'Polish', braz_por: 'Brazilian Portuguese', japanese: 'Japanese', simp_chinese: 'Simplified Chinese' }
  const langOptions = {
    ru: [['russian', 'Русский — l_russian'], ['english', 'English — l_english'], ['french', 'Français — l_french'], ['german', 'Deutsch — l_german'], ['spanish', 'Español — l_spanish'], ['polish', 'Polski — l_polish'], ['braz_por', 'Português (Brasil) — l_braz_por'], ['japanese', '日本語 — l_japanese'], ['simp_chinese', '简体中文 — l_simp_chinese'], ['custom', 'Другой язык…']],
    en: [['russian', 'Russian — l_russian'], ['english', 'English — l_english'], ['french', 'French — l_french'], ['german', 'German — l_german'], ['spanish', 'Spanish — l_spanish'], ['polish', 'Polish — l_polish'], ['braz_por', 'Brazilian Portuguese — l_braz_por'], ['japanese', 'Japanese — l_japanese'], ['simp_chinese', 'Simplified Chinese — l_simp_chinese'], ['custom', 'Other language…']],
  }

  function tr(key, params = {}) {
    let value = translations[app.locale][key] || translations.en[key] || key
    for (const [name, replacement] of Object.entries(params)) value = value.replaceAll(`{${name}}`, String(replacement))
    return value
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
  }
  function getLanguage() {
    if (ui.lang.value === 'custom') return ui.customLang.value.trim().toLowerCase().replace(/^l_/, '')
    return ui.lang.value
  }
  function updateAnalyzeAvailability() {
    ui.analyze.disabled = !(app.baseFile && app.targetFile)
  }
  function showError(message) {
    ui.errors.textContent = message
    ui.errors.hidden = false
  }
  function clearError() {
    ui.errors.hidden = true
    ui.errors.textContent = ''
  }
  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  function renderFileMeta(file, container) {
    if (!file) {
      container.innerHTML = `<span class="file-empty">${escapeHtml(tr('noFile'))}</span>`
      return
    }
    container.innerHTML = `<span class="file-name">${escapeHtml(file.name)}</span><span class="file-size">${formatBytes(file.size)}</span><span class="file-ok">✓</span>`
  }
  function setFile(which, file) {
    if (!file) return
    clearError()
    if (file.size > 20 * 1024 * 1024) {
      showError(tr('fileTooLarge'))
      return
    }
    if (which === 'base') {
      app.baseFile = file
      renderFileMeta(file, ui.baseMeta)
    } else {
      app.targetFile = file
      renderFileMeta(file, ui.targetMeta)
    }
    ui.results.hidden = true
    updateAnalyzeAvailability()
  }
  function addDropHandlers(drop, which) {
    for (const eventName of ['dragenter', 'dragover']) drop.addEventListener(eventName, (event) => { event.preventDefault(); drop.classList.add('dragover') })
    for (const eventName of ['dragleave', 'drop']) drop.addEventListener(eventName, (event) => { event.preventDefault(); drop.classList.remove('dragover') })
    drop.addEventListener('drop', (event) => setFile(which, event.dataTransfer?.files?.[0]))
  }

  async function readLocFile(file) {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf
    let text
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
    catch { throw new Error(tr('loadError')) }
    return { file, hasBom, parsed: core.parseLoc(text) }
  }
  function issueTitle(issue) {
    if (issue.code === 'header') return tr('headerTitle')
    if (issue.code === 'noKeys') return tr('noKeysTitle')
    if (issue.code === 'filename') return tr('filenameTitle')
    if (issue.code === 'bom') return tr('bomTitle')
    if (issue.code === 'missing') return tr('missingTitle')
    if (issue.code === 'extra') return tr('extraTitle')
    if (issue.code === 'duplicate') return tr('duplicateTitle')
    if (issue.code === 'malformed') return tr('malformedTitle')
    if (issue.code === 'tokens') return tr('tokenTitle')
    return tr('formatMetric')
  }
  function issueText(issue) {
    if (issue.code === 'header') return tr('headerText', issue.params)
    if (issue.code === 'noKeys') return tr('noKeysText')
    if (issue.code === 'filename') return tr('filenameText', issue.params)
    if (issue.code === 'bom') return tr('bomText')
    if (issue.code === 'missing') return tr('missingText')
    if (issue.code === 'extra') return tr('extraText')
    if (issue.code === 'duplicate') return tr('duplicateAt', { line: issue.params.firstLine })
    if (issue.code === 'malformed') return tr('malformedText')
    if (issue.code === 'tokens') return tr('tokenText', issue.params)
    return ''
  }
  function severityIcon(severity) { return severity === 'error' ? '!' : severity === 'warning' ? '!' : 'i' }
  function visibleIssues() {
    if (!app.report) return []
    const { issues } = app.report
    if (app.tab === 'all') return issues
    if (app.tab === 'missing') return issues.filter((issue) => issue.category === 'missing' || issue.category === 'extra')
    if (app.tab === 'tokens') return issues.filter((issue) => issue.category === 'tokens')
    return issues.filter((issue) => issue.category === 'format')
  }
  function renderIssues() {
    const list = visibleIssues()
    ui.issues.innerHTML = list.map((issue) => `<article class="issue issue-${issue.severity}"><span class="issue-icon">${severityIcon(issue.severity)}</span><div><strong>${escapeHtml(issueTitle(issue))}</strong>${issue.key ? ` <code>${escapeHtml(issue.key)}</code>` : ''}<p>${escapeHtml(issueText(issue))}</p></div><span class="issue-location">${escapeHtml(tr('detailsLine', { line: issue.line }))}</span></article>`).join('')
    ui.empty.hidden = list.length !== 0
    ui.issues.hidden = list.length === 0
  }
  function renderResults(report) {
    const { issues, baseCount, targetCount } = report
    const missing = issues.filter((issue) => issue.category === 'missing').length
    const tokenIssues = issues.filter((issue) => issue.category === 'tokens').length
    const formatIssues = issues.filter((issue) => issue.category === 'format').length
    const extras = issues.filter((issue) => issue.category === 'extra').length
    const coverage = baseCount ? Math.max(0, Math.round(((baseCount - missing) / baseCount) * 100)) : 0
    const scoreClass = (count) => count === 0 ? 'good' : count < 4 ? 'warn' : 'bad'
    ui.score.innerHTML = [
      { label: tr('coverage'), value: `${coverage}%`, cls: scoreClass(100 - coverage) },
      { label: tr('missingMetric'), value: missing.toLocaleString(), cls: scoreClass(missing) },
      { label: tr('tokensMetric'), value: tokenIssues.toLocaleString(), cls: scoreClass(tokenIssues) },
      { label: tr('formatMetric'), value: (formatIssues + extras).toLocaleString(), cls: scoreClass(formatIssues + extras) },
    ].map((card) => `<div class="score-card ${card.cls}"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong></div>`).join('')
    $('#count-all').textContent = String(issues.length)
    $('#count-missing').textContent = String(missing + extras)
    $('#count-tokens').textContent = String(tokenIssues)
    $('#count-format').textContent = String(formatIssues)
    ui.results.hidden = false
    renderIssues()
  }
  function escapeLocValue(value) { return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') }
  function downloadText(filename, content, withBom = false, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([...(withBom ? ['\uFEFF'] : []), content], { type: mime })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  function exportMissing() {
    if (!app.report) return
    const { base, target, issues, language } = app.report
    const missing = issues.filter((issue) => issue.code === 'missing')
    const header = `l_${language}:`
    const lines = [header, ...missing.map((issue) => {
      const value = base.parsed.entries.get(issue.key)?.value || ''
      return ` ${issue.key}:0 "${escapeLocValue(value)}"`
    })]
    const stem = target.file.name.replace(/\.ya?ml$/i, '').replace(/_l_[a-z0-9_]+$/i, '') || 'localisation'
    downloadText(`${stem}_l_${language}.yml`, lines.join('\r\n') + '\r\n', true)
  }
  function exportReport() {
    if (!app.report) return
    const report = app.report
    const counts = report.issues.reduce((acc, issue) => { acc[issue.category] = (acc[issue.category] || 0) + 1; return acc }, {})
    const rows = [
      'ModLocale — Clausewitz localisation report',
      `Source: ${report.base.file.name} (${report.baseCount} keys, ${report.base.hasBom ? 'UTF-8 BOM' : 'BOM missing'})`,
      `Target: ${report.target.file.name} (${report.targetCount} keys, ${report.target.hasBom ? 'UTF-8 BOM' : 'BOM missing'})`,
      `Target language: ${report.language}`,
      `Missing: ${counts.missing || 0}; extra: ${counts.extra || 0}; token mismatches: ${counts.tokens || 0}; format findings: ${counts.format || 0}`,
      '', ...report.issues.map((issue) => `[${issue.severity.toUpperCase()}] ${issueTitle(issue)}${issue.key ? ` — ${issue.key}` : ''} (line ${issue.line}): ${issueText(issue)}`),
    ]
    downloadText('modlocale-report.txt', rows.join('\r\n'))
  }
  async function analyze() {
    clearError()
    const language = getLanguage()
    if (!language) { showError(tr('pickLanguage')); return }
    if (app.baseFile === app.targetFile) { showError(tr('sameFile')); return }
    ui.analyze.disabled = true
    try {
      const [base, target] = await Promise.all([readLocFile(app.baseFile), readLocFile(app.targetFile)])
      app.report = core.analyzeFiles(base, target, language)
      app.tab = 'all'
      document.querySelectorAll('.tab').forEach((button) => {
        button.classList.toggle('active', button.dataset.tab === 'all')
        button.setAttribute('aria-selected', String(button.dataset.tab === 'all'))
      })
      renderResults(app.report)
      ui.results.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (error) {
      showError(error.message || tr('loadError'))
    } finally {
      updateAnalyzeAvailability()
    }
  }
  function loadDemo() {
    const baseText = [
      'l_english:',
      ' RD43_focus_winter:0 "Winter Campaign"',
      ' RD43_event_supply:0 "Restore the supply lines"',
      ' RD43_event_decision:0 "Support $COUNTRY$ under §Yemergency law§!"',
      ' RD43_event_result:0 "The £convoy_texticon convoy arrives"',
      ' RD43_event_old:0 "An outdated entry"',
    ].join('\r\n') + '\r\n'
    const targetText = [
      'l_russian:',
      ' RD43_focus_winter:0 "Зимняя кампания"',
      ' RD43_event_supply:0 "Восстановить снабжение"',
      ' RD43_event_decision:0 "Поддержать §Yчрезвычайный закон§!"',
      ' RD43_event_result:0 "Прибыл конвой"',
      ' RD43_event_result:0 "Повторный ключ"',
    ].join('\r\n') + '\r\n'
    app.baseFile = new File([encoder.encode(baseText)], 'rd43_l_english.yml', { type: 'text/yaml' })
    app.targetFile = new File([new Uint8Array([0xef, 0xbb, 0xbf]), encoder.encode(targetText)], 'rd43_l_russian.yml', { type: 'text/yaml' })
    ui.lang.value = 'russian'
    ui.customLang.hidden = true
    ui.baseInput.value = ''
    ui.targetInput.value = ''
    renderFileMeta(app.baseFile, ui.baseMeta)
    renderFileMeta(app.targetFile, ui.targetMeta)
    clearError()
    ui.results.hidden = true
    updateAnalyzeAvailability()
    analyze()
  }
  if (new URLSearchParams(location.search).has('demo')) loadDemo()
  function setLocale(locale) {
    app.locale = locale
    document.documentElement.lang = locale
    for (const element of document.querySelectorAll('[data-i18n]')) {
      const key = element.dataset.i18n
      if (translations[locale][key]) element.innerHTML = translations[locale][key]
    }
    ui.langToggle.textContent = locale === 'ru' ? 'EN' : 'RU'
    ui.langToggle.setAttribute('aria-label', locale === 'ru' ? 'Switch language to English' : 'Переключить язык на русский')
    const current = ui.lang.value
    ui.lang.innerHTML = langOptions[locale].map(([value, label]) => `<option value="${value}">${label}</option>`).join('')
    if ([...ui.lang.options].some((option) => option.value === current)) ui.lang.value = current
    renderFileMeta(app.baseFile, ui.baseMeta)
    renderFileMeta(app.targetFile, ui.targetMeta)
    if (app.report) renderResults(app.report)
  }

  ui.baseInput.addEventListener('change', (event) => setFile('base', event.target.files[0]))
  ui.targetInput.addEventListener('change', (event) => setFile('target', event.target.files[0]))
  addDropHandlers(ui.baseDrop, 'base')
  addDropHandlers(ui.targetDrop, 'target')
  ui.analyze.addEventListener('click', analyze)
  ui.demo.addEventListener('click', loadDemo)
  ui.langToggle.addEventListener('click', () => setLocale(app.locale === 'ru' ? 'en' : 'ru'))
  ui.lang.addEventListener('change', () => { ui.customLang.hidden = ui.lang.value !== 'custom'; updateAnalyzeAvailability() })
  ui.customLang.addEventListener('input', updateAnalyzeAvailability)
  ui.lang.addEventListener('change', () => { if (app.report) app.report = null; ui.results.hidden = true })
  $('#export-report').addEventListener('click', exportReport)
  $('#export-missing').addEventListener('click', exportMissing)
  document.querySelectorAll('.tab').forEach((button) => button.addEventListener('click', () => {
    app.tab = button.dataset.tab
    document.querySelectorAll('.tab').forEach((tab) => {
      const active = tab === button
      tab.classList.toggle('active', active)
      tab.setAttribute('aria-selected', String(active))
    })
    renderIssues()
  }))

  if (!('File' in window) || !('TextDecoder' in window)) ui.demo.disabled = true
})()
