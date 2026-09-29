# Resource Sharing XSL Builder

A lightweight web app for building Resource Sharing letter XSL from survey responses.

Instead of editing raw XSL by hand, staff can answer a short form, preview the generated output, and produce a customized template based on the selected letter and configuration choices.

## What it does

- Asks users a short series of questions.
- Applies survey answers to letter-specific XSL templates.
- Shows a live preview.
- Replaces placeholders like `@@LOGO_URL@@` with survey answers.
- Supports letter-specific follow-up questions that appear only when needed.
- Only shows letter choices that currently have implemented XSL behind them.
- Runs a minimal GitHub Actions validation workflow on pushes and pull requests.

## Project files

- `index.html`: widget markup
- `styles.css`: presentation
- `app.js`: form logic, conditional questions, template loading, and XSL transformation
- `letters/pull-slip-letter/`: Pull Slip Letter XSL and preview XML samples
- `letters/pick-from-shelf/`: Pick from shelf XSL and preview XML samples
- `letters/borrowing-receive-slip/`: Borrowing Receive Slip XSL and preview XML samples

## How to run

Serve the folder from a local or web server, then open `index.html` in a browser.

If you open the file directly with a `file://` URL, browsers may block loading external `.xsl` template files.

## Testing

Run the local validation checks with:

```bash
npm test
```

GitHub Actions will also run the same lightweight validation automatically on pushes, pull requests, and manual workflow runs.

## Embedding

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

## Extending the project

Letter logic currently lives in `app.js`, and real letter templates live in each letter's folder under `letters/`:

- `templateFile` on a letter definition lets that letter load a real XSL file directly from its own folder.
- `assembleScaffoldXsl()` stitches scaffold fragments together for letters that do not yet have a real template file.
- `applyTemplateReplacements()` applies survey answers like logo URL and label choice to the selected template.

To keep growing the app, add another letter folder under `letters/`, add its letter definition, create the matching follow-up questions in `index.html`, and map those answers to template replacements in `app.js`.
