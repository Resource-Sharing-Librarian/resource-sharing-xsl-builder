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
const pullSlipXsl = read('letters/pull-slip-letter/pull-slip-letter.xsl');
const returnSlipXsl = read('letters/resource-sharing-return-slip-letter/resource-sharing-return-slip-letter.xsl');
const stylesCss = read('styles.css');
const sampleXml = read('letters/pull-slip-letter/sample-input.xml');
const returnSlipSampleXml = read('letters/resource-sharing-return-slip-letter/sample-resource-sharing-return-slip.xml');

assert(indexHtml.includes('name="libraryName"'), 'Expected Library Name field in index.html');
assert(indexHtml.includes('name="letterType"'), 'Expected Letter to Customize field in index.html');
assert(indexHtml.includes('name="logoUrl"'), 'Expected logo URL field in index.html');
assert(indexHtml.includes('Yes, add a logo from a URL I will provide'), 'Expected URL logo option label in index.html');
assert(indexHtml.includes('Yes, the library logo configured in Alma'), 'Expected Alma logo option label in index.html');
assert(!indexHtml.includes('Shelving Location for Item'), 'Ful Incoming metadata options should not include Shelving Location for Item');
assert(indexHtml.includes('name="labelChoice"'), 'Expected label choice field in index.html');
assert(indexHtml.includes('id="letter-specific-questions"'), 'Expected letter-specific question container in index.html');
assert(indexHtml.includes('id="rendered-preview"'), 'Expected rendered preview container in index.html');

assert(appJs.includes('function applyTemplateReplacements'), 'Expected template replacement logic in app.js');
assert(appJs.includes('@@LOGO_URL@@'), 'Expected logo placeholder replacement in app.js');
assert(appJs.includes("const ALMA_CONFIGURED_LOGO_SRC = 'cid:logo.jpg'"), 'Expected Alma configured logo source in app.js');
assert(appJs.includes("state.includeLogo !== 'alma-logo'"), 'Expected Alma logo option handling in app.js');
assert(appJs.includes('<img src="cid:logo.jpg" alt="logo"/>'), 'Expected Alma logo option to emit the exact Alma logo img tag');
assert(appJs.includes('function applyLabelChoice'), 'Expected label-selection logic in app.js');
assert(appJs.includes("letters/pull-slip-letter/pull-slip-letter.xsl"), 'Expected real Pull Slip Letter template mapping in app.js');
assert(appJs.includes("letters/resource-sharing-return-slip-letter/resource-sharing-return-slip-letter.xsl"), 'Expected real Resource Sharing Return Slip Letter template mapping in app.js');
assert(appJs.includes("form.addEventListener('submit'"), 'Expected submit-driven preview behavior in app.js');
assert(appJs.includes('letters/pull-slip-letter/sample-input.xml'), 'Expected sample XML preview loading in app.js');
assert(appJs.includes('letters/resource-sharing-return-slip-letter/sample-resource-sharing-return-slip.xml'), 'Expected Resource Sharing Return Slip sample XML preview loading in app.js');
assert(appJs.includes("'resource-sharing-return-slip-letter'") && appJs.includes('needsInlinePreviewIncludes'), 'Expected Resource Sharing Return Slip Letter to inline shared templates for browser preview');
assert(appJs.includes('width:702px !important; border:0; padding:0;" colspan="2"'), 'Expected split digital previews to wrap rebuilt content in a table cell');
assert(appJs.includes('return templateText.replace(digitalSectionBlock, rebuiltDigitalBlock);'), 'Expected split digital layout to replace the original digital block in place');
assert(appJs.includes("const hasBothLabels = state.labelChoice === 'both-labels'"), 'Expected both physical labels to explicitly trigger split layout');
assert(appJs.includes('hasBothLabels || metadataCount >= 8 || hasCheckboxConditionReport || state.includeCustomMessage'), 'Expected physical split layout to use the intended threshold conditions');

assert(pullSlipXsl.includes('@@LOGO_URL@@'), 'Expected @@LOGO_URL@@ placeholder in pull-slip-letter.xsl');
assert(pullSlipXsl.includes('SECTION 10B'), 'Expected label sections in pull-slip-letter.xsl');
assert(!pullSlipXsl.includes('transform: scale(0.40)'), 'Pull Slip print CSS should not shrink content to 40% size');
assert(!pullSlipXsl.includes('overflow: hidden !important'), 'Pull Slip print CSS should not hide overflowing notices or two-column content');
assert(returnSlipXsl.includes('@@returned@@'), 'Expected returned label in resource-sharing-return-slip-letter.xsl');

assert(stylesCss.includes('[hidden]'), 'Expected hidden-element CSS safeguard in styles.css');
assert(sampleXml.includes('<notification_data>'), 'Expected sample notification_data XML');
assert(returnSlipSampleXml.includes('<notification_data>'), 'Expected return slip sample notification_data XML');

console.log('Validation passed.');
