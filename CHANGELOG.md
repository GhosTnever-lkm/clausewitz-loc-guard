# Changelog

## 1.0.2 - 2026-10-10

- Make both localisation file drop zones keyboard-focusable and open the file picker with Enter or Space.
- Add a visible keyboard focus indicator.

## 1.0.1 - 2026-10-10

- Clarify that local copies must run through an HTTP server because the browser module is blocked from `file://` pages.

## 1.0.0 - 2026-10-09

- Detect the Clausewitz `§!` formatting reset token alongside other game markers.
- Escape selected language identifiers before matching localisation filenames.
- Extract parsing and comparison logic into a browser-compatible core module.
- Add deterministic Node.js regression tests and document the local test command.
- Document the file flow and link directly to the online demo.
