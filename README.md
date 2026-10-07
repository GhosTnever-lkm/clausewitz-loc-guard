# ModLocale

**Offline localisation checks for Clausewitz mod files.** Find missing and extra keys, duplicate entries, dropped game tokens, malformed lines, and encoding or language-header issues before you launch a mod.

ModLocale is a small static app. It does not upload files, call an API, or load third-party scripts or fonts. Your files are read in your browser and stay on your device.

## Use it

1. Open [`index.html`](index.html) in a modern browser, or serve this folder with any static web server.
2. Choose a source localisation file and the translation to compare.
3. Select the translation language and click **Check localisation**.
4. Review the report, then optionally download a text report or a BOM-prefixed file containing missing source strings.

Click **Load example** to see the checks without selecting files. Add `?demo` to the URL to open the app directly with the example loaded.

## Checks

- Keys missing from the translation, and translation-only keys that may be outdated.
- Duplicate keys and lines that do not match the supported entry syntax.
- Differences in `$VARIABLE$`, `§Y`, `£icon`, bracketed placeholders, common printf markers, and escaped control characters.
- UTF-8 BOM, language header, and conventional `_l_<language>.yml` or `.yaml` filename suffix.
- A downloadable plain-text report and a target-language file scaffold for missing keys.

The interface is available in Russian and English. It includes common Paradox language codes and accepts a custom language code.

## Supported format and limits

This is a focused checker for the common Clausewitz localisation form:

```yaml
l_english:
 KEY_NAME:0 "Text with $VARIABLE$ and §Ygame formatting§!"
```

It handles UTF-8 input, optional `:0` style numeric versions, quoted values and common backslash escapes. It is not a general YAML parser, translator, game launcher, or validator for every title-specific token. Review the generated file in your mod and in the game before release.

## Development

No build step or dependency installation is required. Edit `index.html`, `styles.css`, or `app.js`, then reload the page. For a local server, for example:

```sh
python -m http.server 8000
```

Open `http://127.0.0.1:8000/` in the browser.

## License

MIT. See [LICENSE](LICENSE).
