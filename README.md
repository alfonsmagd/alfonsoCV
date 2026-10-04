# Alfonso Mateos — Portfolio

A minimal, responsive C++ and graphics engineering portfolio. Black and white, a muted cyan accent, and the original WebGL avatar.

## Preview locally

From the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. Serve through HTTP rather than opening a `file://` URL: the avatar loads its OBJ and texture with browser requests. `dev.html` redirects to the same page.

## Files

- `index.html`: profile, projects, experience, education and contact links.
- `css/styles.css`: responsive layout, typography, portrait clipping and monochrome treatment.
- `js/main.js`: active navigation and the rotation-only WebGL viewer.
- `js/obj-loader.js`: existing OBJ and texture loader, with HTTP error handling.
- `assets/images/alfonso-portrait.png`: supplied portrait; the white edge is hidden non-destructively with CSS.
- `assets/model3D/`: original avatar and texture.

No build step or framework is required. Fonts load from Google Fonts, with local sans-serif fallbacks. Content and contact links remain usable without JavaScript.

## 3D portrait

Drag horizontally with a mouse or touch to rotate. Mouse dragging also allows a limited vertical tilt. Focus the canvas and use arrow keys; Home resets its orientation and lighting. Rotation changes the key and fill lighting randomly with smooth, bounded transitions. There are no visible controls, zoom, colour settings or automatic rotation. Vertical touch gestures can scroll the page.

The viewer renders after interaction or resizing and while a short lighting transition is settling. It uses the original geometry with `drawArrays`, avoiding the old 16-bit index limit. Errors and unsupported WebGL show an inline message without blocking the CV. Relative asset paths work under GitHub Pages project subdirectories and on `index.html`.

## Publishing

This is a static site compatible with GitHub Pages. Deploy the repository root through the repository's existing Pages configuration. See `deploy.md`. Local preview changes do not publish automatically.

## Design

Inspired by the quiet dark layout of the W3Schools Dark Portfolio reference, with original layout and styling. The CV remains in English, matching the original content. Professional responsibilities and technologies are shown in full; original project photographs appear in visible galleries below each role, while personal-project technical details use native accessible disclosures. Reduced-motion preferences, keyboard focus, mobile navigation and a print stylesheet are included.
