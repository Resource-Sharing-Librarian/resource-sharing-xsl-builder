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
const returnSlipModuleJs = read('letters/resource-sharing-return-slip-letter/letter-module.js');
const pullSlipXsl = read('letters/pull-slip-letter/pull-slip-letter.xsl');
const returnSlipXsl = read('letters/resource-sharing-return-slip-letter/resource-sharing-return-slip-letter.xsl');
const stylesCss = read('styles.css');
const lettersReadme = read('letters/README.md');
const sampleXml = read('letters/pull-slip-letter/sample-input.xml');
const returnSlipSampleXml = read('letters/resource-sharing-return-slip-letter/sample-resource-sharing-return-slip.xml');
const pickFromShelfXsl = read('letters/pick-from-shelf/pull-slip-request-letter.xsl');
const borrowingReceiveSlipXsl = read('letters/borrowing-receive-slip/borrowing-receive-slip.xsl');
const borrowingReceiveBookWrapXsl = read('letters/borrowing-receive-slip/borrowing-receive-book-wrap.xsl');

assert(!indexHtml.includes('name="libraryName"'), 'Library Name field should not appear in index.html');
assert(!indexHtml.includes('Library Name</span>'), 'Library Name label should not appear in index.html');
assert(indexHtml.includes('name="letterType"'), 'Expected Letter to Customize field in index.html');
assert(indexHtml.includes('name="logoUrl"'), 'Expected logo URL field in index.html');
assert(indexHtml.includes('letters/resource-sharing-return-slip-letter/letter-module.js'), 'Expected Return Slip letter module to load before app.js');
assert(indexHtml.includes('name="returnSlipContentMode"'), 'Expected Return Slip content mode field in index.html');
assert(indexHtml.includes('Just a shipping label'), 'Expected Return Slip shipping-label-only option in index.html');
assert(indexHtml.includes('Shipping label and book information'), 'Expected Return Slip book information option in index.html');
assert(indexHtml.includes('name="preventSpecificPods"'), 'Expected Return Slip pod-prevention question in index.html');
assert(indexHtml.includes('Do you need the Letter to be prevented from printing for items in specific pods?'), 'Expected Return Slip pod-prevention question text in index.html');
assert(indexHtml.includes('name="preventSpecificPodName"'), 'Expected Return Slip exact pod name field in index.html');
assert(indexHtml.includes('What pods? (must be exact name)'), 'Expected Return Slip exact pod name question text in index.html');
assert(indexHtml.includes('data-dependent-question="preventSpecificPods" data-dependent-value="yes"'), 'Expected Return Slip pod name question to depend on the Yes answer');
assert(indexHtml.includes('name="preventAdditionalPods"'), 'Expected Return Slip additional pods question in index.html');
assert(indexHtml.includes('Do you need to stop printing for additional pods?'), 'Expected Return Slip additional pods question text in index.html');
assert(indexHtml.includes('id="additional-pod-fields"'), 'Expected Return Slip dynamic additional pod field container in index.html');
assert(indexHtml.includes('name="returnSlipPrintMethod"'), 'Expected Return Slip print method field in index.html');
assert(indexHtml.includes('Printing size and method.'), 'Expected Return Slip print method question in index.html');
assert(indexHtml.includes('Default size'), 'Expected Return Slip default size option in index.html');
assert(indexHtml.includes('Print full page for printing multiple per page'), 'Expected Return Slip full-page print option in index.html');
assert(indexHtml.includes('data-dependent-question="returnSlipContentMode" data-dependent-value="shipping-label-only"'), 'Expected Return Slip print method question to depend on shipping-label-only mode');
assert(indexHtml.includes('data-letter-question="resource-sharing-return-slip-letter" data-dependent-question="returnSlipContentMode" data-dependent-value="include-book-information"'), 'Expected Return Slip logo question to depend on book-information mode');
assert(indexHtml.includes('data-metadata-group="return-slip-book-information"'), 'Expected Return Slip metadata chooser in index.html');
assert(indexHtml.includes('value="note-to-partner"'), 'Expected Return Slip metadata chooser to include Note to Partner');
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
assert(appJs.includes('width:350px; max-width:350px; text-align:center;'), 'Expected Return Slip logo block to align with the metadata column');
assert(appJs.includes('function getActiveMetadataOptions'), 'Expected metadata choices to be scoped to the active letter');
assert(appJs.includes('function getLetterModule'), 'Expected app.js to route letter-specific logic through folder modules');
assert(appJs.includes('letterModule.applyTemplateReplacements'), 'Expected app.js to call letter-specific replacement modules');
assert(returnSlipModuleJs.includes("const letterId = 'resource-sharing-return-slip-letter'"), 'Expected Return Slip module to register itself by letter ID');
assert(returnSlipModuleJs.includes('function buildMetadataBlock'), 'Expected Return Slip metadata block builder in the Return Slip module');
assert(returnSlipModuleJs.includes('function applyMetadataSelection'), 'Expected Return Slip metadata selection in the Return Slip module');
assert(returnSlipModuleJs.includes('metadataOptions'), 'Expected Return Slip metadata option mapping in the Return Slip module');
assert(returnSlipModuleJs.includes('compactForBookInformation: true'), 'Expected Return Slip book-information layout to use compact appended labels');
assert(returnSlipModuleJs.includes("'170px'") && returnSlipModuleJs.includes("'210px'"), 'Expected Return Slip compact labels to fit all metadata on one page');
assert(returnSlipModuleJs.includes('function applyPodPrintPrevention'), 'Expected Return Slip pod print prevention in the Return Slip module');
assert(returnSlipModuleJs.includes("state.preventSpecificPods !== 'yes'"), 'Expected Return Slip pod print prevention to depend on the Yes answer');
assert(returnSlipModuleJs.includes('state.preventSpecificPodName'), 'Expected Return Slip pod print prevention to use the entered pod name');
assert(returnSlipModuleJs.includes('state.additionalPreventSpecificPodNames'), 'Expected Return Slip pod print prevention to use additional entered pod names');
assert(returnSlipModuleJs.includes('podNames.flatMap'), 'Expected Return Slip pod print prevention to generate one stop block per pod');
assert(returnSlipModuleJs.includes('helpers.escapeXml(podName)'), 'Expected Return Slip pod print prevention to XML-escape the entered pod name');
assert(returnSlipModuleJs.includes('xsl:message terminate="yes"'), 'Expected Return Slip pod print prevention to stop the label with xsl:message');
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
assert(appJs.includes('border-bottom:2px solid #000'), 'Expected Return Slip shipping label separators to match the metadata outline');
assert(appJs.includes('<b>Title: </b><xsl:value-of select="notification_data/request/display/title"/>'), 'Expected Return Slip shipping label to include the book title');
assert(appJs.includes('<b>External Identifier: </b><xsl:value-of select="notification_data/request/external_request_id"/>'), 'Expected Return Slip shipping label to include the external identifier');
assert(appJs.includes("state.returnSlipContentMode === 'shipping-label-only'"), 'Expected Return Slip shipping-label-only handling in app.js');
assert(appJs.includes("state.returnSlipContentMode === 'include-book-information'"), 'Expected Return Slip book-information mode to be customized in app.js');
assert(appJs.includes("returnSlipPrintMethod: 'default-size'"), 'Expected Return Slip book-information mode to append a default-sized shipping label');
assert(appJs.includes('omitReferenceBlock: true'), 'Expected Return Slip book-information shipping label to omit the reference header');
assert(appJs.includes('alignWithBookMetadata: true'), 'Expected Return Slip book-information shipping label to align with the metadata box');
assert(appJs.includes('margin-left:20px'), 'Expected appended Return Slip shipping label to align with the metadata box');
assert(appJs.includes('returnSlipPrintMethod: getActiveFieldValue'), 'Expected Return Slip print method in form state');
assert(appJs.includes('preventSpecificPods: getActiveFieldValue'), 'Expected Return Slip pod-prevention answer in form state');
assert(appJs.includes('preventSpecificPodName: getActiveFieldValue'), 'Expected Return Slip exact pod name in form state');
assert(appJs.includes('additionalPreventSpecificPodNames: getAdditionalPreventSpecificPodNames'), 'Expected Return Slip additional pod names in form state');
assert(appJs.includes('function appendAdditionalPodEntry'), 'Expected Return Slip dynamic additional pod fields in app.js');
assert(appJs.includes('select[name="additionalPreventSpecificPods"]'), 'Expected Return Slip repeated additional pods question in app.js');
assert(appJs.includes("syncQuestionsFromChange('preventSpecificPods')"), 'Expected Return Slip pod-prevention answer to refresh dependent questions');
assert(appJs.includes('escapeXml'), 'Expected letter modules to receive XML escaping helper');
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
assert(returnSlipXsl.includes('width:350px; max-width:350px; border:2px solid #000'), 'Expected Return Slip book-information metadata table to keep its full outline');
assert(returnSlipXsl.includes('width:350px; max-width:350px; text-align:center;') && returnSlipXsl.includes('src="cid:externalId.png" alt="externalId"') && returnSlipXsl.includes('display:block; margin-left:63px; margin-right:0;'), 'Expected Return Slip barcode image to use Alma cid image source');
assert(returnSlipXsl.includes('RETURN SLIP LOGO INSERTION POINT'), 'Expected Return Slip logo insertion point above the request barcode');
assert(returnSlipXsl.includes('BEGIN OPTIONAL BOOK INFORMATION'), 'Expected optional book information marker in resource-sharing-return-slip-letter.xsl');
assert(!returnSlipXsl.includes('BEGIN OPTIONAL RETURN SLIP SIGNATURE'), 'Resource Sharing Return Slip Letter should not show a standalone address signature above the shipping label');
assert(!returnSlipXsl.includes('@@address@@'), 'Resource Sharing Return Slip Letter should not show the partner address outside the shipping label');
assert(!returnSlipXsl.includes('partner_phone'), 'Resource Sharing Return Slip Letter should not show partner phone');
assert(returnSlipXsl.includes("notification_data/request/display/volume !=''"), 'Expected Return Slip volume row to hide when empty');
assert(returnSlipXsl.includes("notification_data/request/display/issue !=''"), 'Expected Return Slip issue row to hide when empty');
assert(returnSlipXsl.includes("notification_data/note_to_partner !=''"), 'Expected Return Slip note-to-partner row to hide when empty');
assert(!returnSlipXsl.includes('@@arrival_date@@'), 'Resource Sharing Return Slip Letter should not show arrival date');
assert(!returnSlipXsl.includes('@@required_return_date@@'), 'Resource Sharing Return Slip Letter should not show required return date');
assert(!returnSlipXsl.includes('@@request_id@@'), 'Resource Sharing Return Slip Letter should not show a Request ID label before the barcode');
assert(!returnSlipXsl.includes('<xsl:call-template name="head"/>'), 'Resource Sharing Return Slip Letter should not render the Alma header');
assert(!returnSlipXsl.includes('<xsl:call-template name="lastFooter"/>'), 'Resource Sharing Return Slip Letter should not render the Alma footer');

const supportedMetadataLabelSources = [
  appJs,
  returnSlipModuleJs,
  pullSlipXsl,
  pickFromShelfXsl,
  borrowingReceiveSlipXsl,
  borrowingReceiveBookWrapXsl,
  returnSlipXsl
].join('\n');
const rawMetadataLabelPattern = /@@(?:title|author|year|publication_date|volume|issue|pages|publisher|place_of_publication|oclc_number|edition|isbn|issn|borrower_reference|request_note|chapter_number|chapter_title|chapter_author|journal_title|article_title|email|phone|note_to_partner|requester_email)@@/;
assert(!rawMetadataLabelPattern.test(supportedMetadataLabelSources), 'Supported letter metadata labels should use readable display text');
assert(!supportedMetadataLabelSources.includes('Borrower Reference'), 'Borrower Reference labels should display as External ID');
assert(supportedMetadataLabelSources.includes('External ID'), 'Expected borrower reference metadata to display as External ID');

assert(stylesCss.includes('[hidden]'), 'Expected hidden-element CSS safeguard in styles.css');
assert(sampleXml.includes('<notification_data>'), 'Expected sample notification_data XML');
assert(returnSlipSampleXml.includes('<notification_data>'), 'Expected return slip sample notification_data XML');
assert(lettersReadme.includes('letter-module.js'), 'Expected letters README to document the per-letter module pattern');

console.log('Validation passed.');
