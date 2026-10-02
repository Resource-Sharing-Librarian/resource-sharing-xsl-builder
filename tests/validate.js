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
assert(indexHtml.includes('name="returnSlipContentMode"'), 'Expected Return Slip content mode field in index.html');
assert(indexHtml.includes('Just a shipping label'), 'Expected Return Slip shipping-label-only option in index.html');
assert(indexHtml.includes('Shipping label and book information'), 'Expected Return Slip book information option in index.html');
assert(indexHtml.includes('name="returnSlipPrintMethod"'), 'Expected Return Slip print method field in index.html');
assert(indexHtml.includes('Printing size and method.'), 'Expected Return Slip print method question in index.html');
assert(indexHtml.includes('Default size'), 'Expected Return Slip default size option in index.html');
assert(indexHtml.includes('Print full page for printing multiple per page'), 'Expected Return Slip full-page print option in index.html');
assert(indexHtml.includes('data-dependent-question="returnSlipContentMode" data-dependent-value="shipping-label-only"'), 'Expected Return Slip print method question to depend on shipping-label-only mode');
assert(indexHtml.includes('data-letter-question="resource-sharing-return-slip-letter" data-dependent-question="returnSlipContentMode" data-dependent-value="include-book-information"'), 'Expected Return Slip logo question to depend on book-information mode');
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
assert(appJs.includes('function applyReturnSlipLogoChoice'), 'Expected Return Slip logo handling in app.js');
assert(appJs.includes('function buildReturnSlipLogoBlock'), 'Expected Return Slip logo block builder in app.js');
assert(appJs.includes('function getActiveFieldValue'), 'Expected duplicate logo controls to use active field values');
assert(appJs.includes('select[name="includeLogo"]'), 'Expected every logo dropdown to refresh dependent questions');
assert(appJs.includes('function applyLabelChoice'), 'Expected label-selection logic in app.js');
assert(appJs.includes("letters/pull-slip-letter/pull-slip-letter.xsl"), 'Expected real Pull Slip Letter template mapping in app.js');
assert(appJs.includes("letters/resource-sharing-return-slip-letter/resource-sharing-return-slip-letter.xsl"), 'Expected real Resource Sharing Return Slip Letter template mapping in app.js');
assert(appJs.includes('function applyReturnSlipContentChoice'), 'Expected Return Slip content mode customization in app.js');
assert(appJs.includes('function buildReturnSlipShippingLabelBlock'), 'Expected Return Slip shipping label block builder in app.js');
assert(appJs.includes('<table class="shippingLabel"'), 'Expected Return Slip shipping-label-only mode to use shippingLabel markup');
assert(appJs.includes("state.returnSlipPrintMethod === 'full-page-multiple'"), 'Expected Return Slip full-page print method handling in app.js');
assert(appJs.includes('width:6.4in; max-width:6.4in; height:8.8in'), 'Expected Return Slip full-page labels to use 80 percent page sizing');
assert(appJs.includes('page-break-after:always'), 'Expected Return Slip full-page labels to print as separate pages');
assert(appJs.includes('<b>Title: </b><xsl:value-of select="notification_data/request/display/title"/>'), 'Expected Return Slip shipping label to include the book title');
assert(appJs.includes('<b>External ID: </b><xsl:value-of select="notification_data/request/external_request_id"/>'), 'Expected Return Slip shipping label to include the external ID');
assert(appJs.includes("state.returnSlipContentMode === 'shipping-label-only'"), 'Expected Return Slip shipping-label-only handling in app.js');
assert(appJs.includes("state.returnSlipContentMode === 'include-book-information'"), 'Expected Return Slip book-information mode to be customized in app.js');
assert(appJs.includes("returnSlipPrintMethod: 'default-size'"), 'Expected Return Slip book-information mode to append a default-sized shipping label');
assert(appJs.includes('returnSlipPrintMethod: getActiveFieldValue'), 'Expected Return Slip print method in form state');
assert(appJs.includes("syncQuestionsFromChange('returnSlipContentMode')"), 'Expected Return Slip content mode to refresh dependent questions');
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
assert(returnSlipXsl.includes('Return to Lending Library'), 'Expected Return Slip heading in resource-sharing-return-slip-letter.xsl');
assert(returnSlipXsl.includes('font-size:2em;'), 'Expected Return Slip heading to be twice the normal text size');
assert(returnSlipXsl.includes('BEGIN RETURN SLIP CONTENT'), 'Expected replaceable Return Slip content marker in resource-sharing-return-slip-letter.xsl');
assert(returnSlipXsl.includes('RETURN SLIP LOGO INSERTION POINT'), 'Expected Return Slip logo insertion point above the request barcode');
assert(returnSlipXsl.includes('BEGIN OPTIONAL BOOK INFORMATION'), 'Expected optional book information marker in resource-sharing-return-slip-letter.xsl');
assert(!returnSlipXsl.includes('BEGIN OPTIONAL RETURN SLIP SIGNATURE'), 'Resource Sharing Return Slip Letter should not show a standalone address signature above the shipping label');
assert(!returnSlipXsl.includes('@@address@@'), 'Resource Sharing Return Slip Letter should not show the partner address outside the shipping label');
assert(returnSlipXsl.includes("notification_data/partner_phone/phone !=''"), 'Expected Return Slip phone row to hide when empty');
assert(returnSlipXsl.includes("notification_data/request/display/volume !=''"), 'Expected Return Slip volume row to hide when empty');
assert(returnSlipXsl.includes("notification_data/request/display/issue !=''"), 'Expected Return Slip issue row to hide when empty');
assert(returnSlipXsl.includes("notification_data/note_to_partner !=''"), 'Expected Return Slip note-to-partner row to hide when empty');
assert(!returnSlipXsl.includes('@@arrival_date@@'), 'Resource Sharing Return Slip Letter should not show arrival date');
assert(!returnSlipXsl.includes('@@required_return_date@@'), 'Resource Sharing Return Slip Letter should not show required return date');
assert(!returnSlipXsl.includes('@@request_id@@'), 'Resource Sharing Return Slip Letter should not show a Request ID label before the barcode');
assert(!returnSlipXsl.includes('<xsl:call-template name="head"/>'), 'Resource Sharing Return Slip Letter should not render the Alma header');
assert(!returnSlipXsl.includes('<xsl:call-template name="lastFooter"/>'), 'Resource Sharing Return Slip Letter should not render the Alma footer');

assert(stylesCss.includes('[hidden]'), 'Expected hidden-element CSS safeguard in styles.css');
assert(sampleXml.includes('<notification_data>'), 'Expected sample notification_data XML');
assert(returnSlipSampleXml.includes('<notification_data>'), 'Expected return slip sample notification_data XML');

console.log('Validation passed.');
