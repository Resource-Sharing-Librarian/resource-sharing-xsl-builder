# XSL Builder Prototype

This is a standalone prototype for a website-embedded XSL builder.

## What it does

- Asks users a short series of questions.
- Maps their answers to reusable saved XSL chunks.
- Assembles a final `.xsl` file in the browser.
- Shows a live preview.
- Downloads the generated XSL without a server.
- Replaces placeholders like `@@LOGO_URL@@` with survey answers.

## Files

- `index.html`: widget markup
- `styles.css`: presentation
- `app.js`: form logic, chunk selection, XSL assembly, and download

## How to run

Serve the folder from a local or web server, then open `index.html` in a browser.

If you open the file directly with a `file://` URL, browsers may block loading external `.xsl` template files.

## How to embed

The simplest option is to host this folder and embed it in your site with an `iframe`.

Example:

```html
<iframe
  src="/xsl-builder-prototype/index.html"
  title="XSL Builder"
  width="100%"
  height="1200"
  style="border:0;">
</iframe>
```

If you want the app to live directly inside an existing page instead of an `iframe`, the next step would be to refactor `app.js` into an embeddable widget that mounts into a container like:

```html
<div id="xsl-builder-root"></div>
```

## How to extend the chunk system

The current chunk library is in `app.js`, and real letter templates can also live as separate `.xsl` files beside it:

- `chunkCatalog` controls the visible list of saved chunks.
- `getSelectedChunkIds()` decides which chunks are active.
- `templateFile` on a letter definition lets that letter load a real XSL file directly.
- `buildHeaderChunk()`, `buildGreetingChunk()`, and similar functions return reusable XSL fragments.
- `assembleScaffoldXsl()` stitches scaffold fragments together for letters that do not yet have a real template file.

To support your real project, you would replace the sample chunk functions with your real saved XSL snippets and add more questions that map to your letter variations.
