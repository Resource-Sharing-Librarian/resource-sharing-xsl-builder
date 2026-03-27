const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const indexHtml = read('index.html');
const appJs = read('app.js');
const pullSlipXsl = read('pull-slip-letter.xsl');
const stylesCss = read('styles.css');

assert(indexHtml.includes('name="libraryName"'), 'Expected Library Name field in index.html');
assert(indexHtml.includes('name="letterType"'), 'Expected Letter to Customize field in index.html');
assert(indexHtml.includes('name="logoUrl"'), 'Expected logo URL field in index.html');
assert(indexHtml.includes('name="labelChoice"'), 'Expected label choice field in index.html');
assert(indexHtml.includes('id="letter-specific-questions"'), 'Expected letter-specific question container in index.html');

assert(appJs.includes('function applyTemplateReplacements'), 'Expected template replacement logic in app.js');
assert(appJs.includes('@@LOGO_URL@@'), 'Expected logo placeholder replacement in app.js');
assert(appJs.includes('function applyLabelChoice'), 'Expected label-selection logic in app.js');
assert(appJs.includes("pull-slip-letter.xsl"), 'Expected real Pull Slip Letter template mapping in app.js');
assert(appJs.includes("form.addEventListener('submit'"), 'Expected submit-driven preview behavior in app.js');

assert(pullSlipXsl.includes('@@LOGO_URL@@'), 'Expected @@LOGO_URL@@ placeholder in pull-slip-letter.xsl');
assert(pullSlipXsl.includes('SECTION 10B'), 'Expected label sections in pull-slip-letter.xsl');

assert(stylesCss.includes('[hidden]'), 'Expected hidden-element CSS safeguard in styles.css');

console.log('Validation passed.');
