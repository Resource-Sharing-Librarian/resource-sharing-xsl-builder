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
const sampleXml = read('sample-input.xml');

assert(indexHtml.includes('name="libraryName"'), 'Expected Library Name field in index.html');
assert(indexHtml.includes('name="letterType"'), 'Expected Letter to Customize field in index.html');
assert(indexHtml.includes('name="logoUrl"'), 'Expected logo URL field in index.html');
assert(indexHtml.includes('name="labelChoice"'), 'Expected label choice field in index.html');
assert(indexHtml.includes('id="letter-specific-questions"'), 'Expected letter-specific question container in index.html');
assert(indexHtml.includes('id="rendered-preview"'), 'Expected rendered preview container in index.html');

assert(appJs.includes('function applyTemplateReplacements'), 'Expected template replacement logic in app.js');
assert(appJs.includes('@@LOGO_URL@@'), 'Expected logo placeholder replacement in app.js');
assert(appJs.includes('function applyLabelChoice'), 'Expected label-selection logic in app.js');
assert(appJs.includes("pull-slip-letter.xsl"), 'Expected real Pull Slip Letter template mapping in app.js');
assert(appJs.includes("form.addEventListener('submit'"), 'Expected submit-driven preview behavior in app.js');
assert(appJs.includes('sample-input.xml'), 'Expected sample XML preview loading in app.js');
assert(appJs.includes("const hasBothLabels = state.labelChoice === 'both-labels'"), 'Expected both physical labels to explicitly trigger split layout');
assert(appJs.includes('hasBothLabels || metadataCount >= 8 || hasCheckboxConditionReport || state.includeCustomMessage'), 'Expected physical split layout to use the intended threshold conditions');

assert(pullSlipXsl.includes('@@LOGO_URL@@'), 'Expected @@LOGO_URL@@ placeholder in pull-slip-letter.xsl');
assert(pullSlipXsl.includes('SECTION 10B'), 'Expected label sections in pull-slip-letter.xsl');
assert(!pullSlipXsl.includes('transform: scale(0.40)'), 'Pull Slip print CSS should not shrink content to 40% size');
assert(!pullSlipXsl.includes('overflow: hidden !important'), 'Pull Slip print CSS should not hide overflowing notices or two-column content');

assert(stylesCss.includes('[hidden]'), 'Expected hidden-element CSS safeguard in styles.css');
assert(sampleXml.includes('<notification_data>'), 'Expected sample notification_data XML');

console.log('Validation passed.');
