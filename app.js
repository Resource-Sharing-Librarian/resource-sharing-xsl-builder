const form = document.querySelector('#builder-form');
const preview = document.querySelector('#xsl-preview');
const renderedPreview = document.querySelector('#rendered-preview');
const resetButton = document.querySelector('#reset-button');
const copyXslButton = document.querySelector('#copy-xsl-button');
const downloadXslButton = document.querySelector('#download-xsl-button');
const previewSampleButtons = Array.from(document.querySelectorAll('[data-preview-sample]'));
const letterSpecificQuestions = document.querySelector('#letter-specific-questions');
const letterQuestionGroups = Array.from(document.querySelectorAll('[data-letter-question]'));
const dependentQuestionGroups = Array.from(document.querySelectorAll('[data-dependent-question]'));
const templateCache = {};
const sampleXmlCache = {};
let toastTimeoutId = null;
let selectedPreviewSample = 'book';

const previewSampleDefinitions = {
  book: {
    label: 'Book',
    file: './sample-input.xml'
  },
  'book-chapter': {
    label: 'Book Chapter',
    file: './sample-book-chapter.xml'
  },
  article: {
    label: 'Article',
    file: './sample-article.xml'
  }
};

const letterDefinitions = {
  'pull-slip-letter': {
    code: 'A',
    shortName: 'Pull Slip Letter',
    almaLetter: 'Ful Incoming Slip Letter',
    chunks: ['shell', 'real-template-file'],
    templateFile: './pull-slip-letter.xsl'
  },
  'pick-from-shelf': {
    code: 'B',
    shortName: 'Pick from shelf',
    almaLetter: 'Ful Resource Request Letter',
    chunks: ['shell', 'letter-meta', 'library-header', 'request-fields', 'pickup-workflow', 'staff-contact', 'closing']
  },
  'borrowing-receive-slip': {
    code: 'C',
    shortName: 'Borrowing Receive Slip',
    almaLetter: 'Resource Sharing Receive Slip Letter',
    chunks: ['shell', 'letter-meta', 'library-header', 'request-fields', 'shipping-fields', 'staff-contact', 'closing']
  },
  'return-label': {
    code: 'D',
    shortName: 'Return Label',
    almaLetter: 'Resource Sharing Return Slip Letter',
    chunks: ['shell', 'letter-meta', 'library-header', 'shipping-fields', 'return-label', 'staff-contact', 'closing']
  },
  'query-to-patron': {
    code: 'E',
    shortName: 'Query to Patron Letter',
    almaLetter: 'Query to Patron Letter',
    chunks: ['shell', 'letter-meta', 'library-header', 'request-fields', 'patron-message', 'staff-contact', 'closing']
  },
  'cancellation-letter': {
    code: 'F',
    shortName: 'Cancellation Letter',
    almaLetter: 'Ful Cancel Request Letter',
    chunks: ['shell', 'letter-meta', 'library-header', 'request-fields', 'cancellation-note', 'staff-contact', 'closing']
  },
  'hold-shelf-letter': {
    code: 'G',
    shortName: 'Hold Shelf Letter',
    almaLetter: 'On Hold Shelf Letter',
    chunks: ['shell', 'letter-meta', 'library-header', 'request-fields', 'hold-shelf', 'staff-contact', 'closing']
  }
};

const chunkCatalog = [
  {
    id: 'shell',
    label: 'Stylesheet shell',
    description: 'Creates the XML declaration, stylesheet wrapper, and root template.'
  },
  {
    id: 'letter-meta',
    label: 'Letter metadata',
    description: 'Adds comments and variables identifying the selected letter template.'
  },
  {
    id: 'real-template-file',
    label: 'Real XSL template',
    description: 'Loads the current production XSL file for this letter instead of a scaffold.'
  },
  {
    id: 'library-header',
    label: 'Library header',
    description: 'Prints the library name and the display name of the chosen letter.'
  },
  {
    id: 'request-fields',
    label: 'Request fields',
    description: 'Outputs common request details like title, author, and request identifier.'
  },
  {
    id: 'pickup-workflow',
    label: 'Pickup workflow',
    description: 'Adds workflow fields for pick-from-shelf processing.'
  },
  {
    id: 'shipping-fields',
    label: 'Shipping fields',
    description: 'Outputs return-address or shipping placeholders.'
  },
  {
    id: 'return-label',
    label: 'Return label block',
    description: 'Prints a compact label-oriented layout for returns.'
  },
  {
    id: 'patron-message',
    label: 'Patron query message',
    description: 'Adds a placeholder section for a question that needs a patron response.'
  },
  {
    id: 'cancellation-note',
    label: 'Cancellation note',
    description: 'Adds cancellation messaging and a reason placeholder.'
  },
  {
    id: 'hold-shelf',
    label: 'Hold shelf notice',
    description: 'Adds pickup-by and hold-location placeholders.'
  },
  {
    id: 'staff-contact',
    label: 'Staff contact',
    description: 'Prints the configured contact email address.'
  },
  {
    id: 'closing',
    label: 'Closing block',
    description: 'Closes the document and signs it with the library name.'
  }
];

const defaultState = readFormState();

function readFormState() {
  return {
    libraryName: form.elements.libraryName.value.trim(),
    letterType: form.elements.letterType.value,
    includeLogo: form.elements.includeLogo.value,
    logoUrl: form.elements.logoUrl.value.trim(),
    labelChoice: form.elements.labelChoice.value,
    includeCreateDate: form.elements.includeCreateDate.value,
    createDateFormat: form.elements.createDateFormat.value,
    noteAreaType: form.elements.noteAreaType.value
  };
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getLetterDefinition(letterType) {
  return letterDefinitions[letterType] || letterDefinitions['pull-slip-letter'];
}

function syncLetterSpecificQuestions() {
  const selectedLetter = form.elements.letterType.value;
  const hasLetter = Boolean(selectedLetter);
  const logoUrlField = form.elements.logoUrl;
  const includeLogoField = form.elements.includeLogo;

  letterSpecificQuestions.hidden = !hasLetter;
  letterSpecificQuestions.style.display = hasLetter ? '' : 'none';

  letterQuestionGroups.forEach((element) => {
    const isMatch = element.dataset.letterQuestion === selectedLetter;
    element.hidden = !isMatch;
    element.style.display = isMatch ? '' : 'none';
  });

  dependentQuestionGroups.forEach((element) => {
    const controllingField = form.elements[element.dataset.dependentQuestion];
    const expectedValue = element.dataset.dependentValue;
    const shouldShow = hasLetter
      && element.dataset.letterQuestion === selectedLetter
      && controllingField
      && controllingField.value === expectedValue;

    element.hidden = !shouldShow;
    element.style.display = shouldShow ? '' : 'none';
  });

  if (logoUrlField && includeLogoField) {
    const requiresLogoUrl = hasLetter
      && selectedLetter === 'pull-slip-letter'
      && includeLogoField.value === 'yes';

    logoUrlField.required = requiresLogoUrl;

    if (!requiresLogoUrl) {
      logoUrlField.value = '';
    }
  }
}

function removeSectionByPattern(templateText, pattern) {
  return templateText.replace(pattern, '');
}

function applyLabelChoice(templateText, state) {
  const shippingPattern = /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 10B [—-] SHIPPING LABEL\r?\n[ \t]*NOTE: Addresses MUST remain full; do not truncate\.\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 10B [—-] SHIPPING LABEL ===== -->[^\S\r\n]*/;
  const returnPattern = /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 10B [—-] Return LABEL ?\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 10B [—-] SHIPPING LABEL \(SWAPPED\) ===== -->[^\S\r\n]*/;

  if (state.labelChoice === 'shipping-label') {
    return removeSectionByPattern(templateText, returnPattern);
  }

  if (state.labelChoice === 'return-label') {
    return removeSectionByPattern(templateText, shippingPattern);
  }

  return removeSectionByPattern(
    removeSectionByPattern(templateText, shippingPattern),
    returnPattern
  );
}

function applyCreateDateChoice(templateText, state) {
  const createDatePattern = /[ \t]*<!-- BEGIN OPTIONAL CREATE DATE -->[\s\S]*?<!-- END OPTIONAL CREATE DATE -->[^\S\r\n]*/;

  if (state.includeCreateDate === 'no') {
    return removeSectionByPattern(templateText, createDatePattern);
  }

  return templateText;
}

function applyCreateDateFormat(templateText, state) {
  return templateText.replaceAll('@@CREATE_DATE_FORMAT@@', state.createDateFormat || 'numerical');
}

function applyNoteAreaChoice(templateText, state) {
  const notePattern = /[ \t]*<!-- BEGIN OPTIONAL NOTE AREA -->[\s\S]*?<!-- END OPTIONAL NOTE AREA -->[^\S\r\n]*/;

  if (state.noteAreaType === 'none') {
    return removeSectionByPattern(templateText, notePattern);
  }

  if (state.noteAreaType === 'checkboxes') {
    const checkboxBlock = [
      '                    <!-- BEGIN OPTIONAL NOTE AREA -->',
      '                    <tr>',
      '                      <td><b><span style="text-decoration:underline;">Item Condition Report:</span></b></td>',
      '                    </tr>',
      '                    <table cellspacing="0" cellpadding="5" border="0" style="width:350px; max-width:350px; table-layout:fixed; border-collapse:collapse;">',
      '                      <tr>',
      '                        <td><b><span style="font-size:18px;">&#9633;</span> Binding Issues</b></td>',
      '                        <td><b><span style="font-size:18px;">&#9633;</span> Writing</b></td>',
      '                      </tr>',
      '                      <tr>',
      '                        <td><b><span style="font-size:18px;">&#9633;</span> Cover/Spine Issues</b></td>',
      '                        <td><b><span style="font-size:18px;">&#9633;</span> Liquid/Stained</b></td>',
      '                      </tr>',
      '                      <tr>',
      '                        <td><b><span style="font-size:18px;">&#9633;</span> Missing CD/DVD</b></td>',
      '                        <td><b><span style="font-size:18px;">&#9633;</span> Other</b></td>',
      '                      </tr>',
      '                    </table>',
      '                    <xsl:call-template name="spacer" />',
      '                    <!-- END OPTIONAL NOTE AREA -->'
    ].join('\n');

    return templateText.replace(notePattern, checkboxBlock);
  }

  return templateText;
}

function applyTemplateReplacements(templateText, state) {
  const logoUrl = state.includeLogo === 'yes' ? state.logoUrl : '';
  let output = templateText.replaceAll('@@LOGO_URL@@', logoUrl || '');

  if (state.letterType === 'pull-slip-letter') {
    output = applyLabelChoice(output, state);
    output = applyCreateDateChoice(output, state);
    output = applyCreateDateFormat(output, state);
    output = applyNoteAreaChoice(output, state);
  }

  return output;
}

function normalizeXmlForParsing(text) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/^\s+<\?xml/, '<?xml');
}

function buildLetterMetaChunk(state, definition) {
  return [
    `  <!-- Letter ${definition.code}: ${definition.shortName} -->`,
    `  <!-- Alma letter: ${definition.almaLetter} -->`,
    `  <xsl:variable name="libraryName" select="'${escapeXml(state.libraryName || 'My Library')}'"/>`,
    ''
  ].join('\n');
}

function buildLibraryHeaderChunk(state, definition) {
  return [
    '    <letter>',
    '      <header class="letter-header">',
    `        <h1><xsl:value-of select="$libraryName"/></h1>`,
    `        <p><xsl:text>${escapeXml(definition.shortName)}</xsl:text></p>`,
    '      </header>'
  ].join('\n');
}

function buildRequestFieldsChunk() {
  return [
    '      <section class="request-fields">',
    '        <p><strong>Request ID:</strong> <xsl:value-of select="request_id"/></p>',
    '        <p><strong>Title:</strong> <xsl:value-of select="title"/></p>',
    '        <p><strong>Author:</strong> <xsl:value-of select="author"/></p>',
    '      </section>'
  ].join('\n');
}

function buildPickupWorkflowChunk() {
  return [
    '      <section class="pickup-workflow">',
    '        <p><strong>Pickup Location:</strong> <xsl:value-of select="request/work_flow_entity/assigned_unit_name"/></p>',
    '        <p><strong>Shelving Location:</strong> <xsl:value-of select="phys_item_display/location_name"/></p>',
    '      </section>'
  ].join('\n');
}

function buildShippingFieldsChunk() {
  return [
    '      <section class="shipping-fields">',
    '        <p><strong>Ship To:</strong> <xsl:value-of select="partner_name"/></p>',
    '        <p><strong>Barcode:</strong> <xsl:value-of select="phys_item_display/barcode"/></p>',
    '      </section>'
  ].join('\n');
}

function buildReturnLabelChunk() {
  return [
    '      <section class="return-label">',
    '        <p><strong>Return To:</strong> <xsl:value-of select="library_address"/></p>',
    '        <p><strong>Request ID:</strong> <xsl:value-of select="request_id"/></p>',
    '      </section>'
  ].join('\n');
}

function buildPatronMessageChunk() {
  return [
    '      <section class="patron-message">',
    '        <p><strong>Question for patron:</strong> <xsl:value-of select="message"/></p>',
    '      </section>'
  ].join('\n');
}

function buildCancellationNoteChunk() {
  return [
    '      <section class="cancellation-note">',
    '        <p><strong>Cancellation reason:</strong> <xsl:value-of select="reason"/></p>',
    '      </section>'
  ].join('\n');
}

function buildHoldShelfChunk() {
  return [
    '      <section class="hold-shelf">',
    '        <p><strong>Hold Shelf Location:</strong> <xsl:value-of select="request/current_location"/></p>',
    '        <p><strong>Pickup By:</strong> <xsl:value-of select="expiry_date"/></p>',
    '      </section>'
  ].join('\n');
}

function buildClosingChunk(state) {
  return [
    '      <footer class="letter-footer">',
    `        <p><xsl:text>${escapeXml(state.libraryName || 'My Library')}</xsl:text></p>`,
    '      </footer>',
    '    </letter>'
  ].join('\n');
}

function assembleScaffoldXsl(state) {
  const definition = getLetterDefinition(state.letterType);
  const body = [];

  const chunkBuilders = {
    'library-header': () => buildLibraryHeaderChunk(state, definition),
    'request-fields': () => buildRequestFieldsChunk(),
    'pickup-workflow': () => buildPickupWorkflowChunk(),
    'shipping-fields': () => buildShippingFieldsChunk(),
    'return-label': () => buildReturnLabelChunk(),
    'patron-message': () => buildPatronMessageChunk(),
    'cancellation-note': () => buildCancellationNoteChunk(),
    'hold-shelf': () => buildHoldShelfChunk(),
    'closing': () => buildClosingChunk(state)
  };

  definition.chunks.forEach((chunkId) => {
    if (chunkId === 'shell' || chunkId === 'letter-meta') {
      return;
    }

    const builder = chunkBuilders[chunkId];

    if (builder) {
      body.push(builder());
    }
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<xsl:stylesheet version="1.0"',
    '  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
    buildLetterMetaChunk(state, definition),
    '  <xsl:template match="/">',
    '    <xsl:apply-templates select="notification_data"/>',
    '  </xsl:template>',
    '',
    '  <xsl:template match="notification_data">',
    ...body,
    '  </xsl:template>',
    '</xsl:stylesheet>'
  ].join('\n');
}

async function getTemplateText(state) {
  const definition = getLetterDefinition(state.letterType);

  if (!definition.templateFile) {
    return applyTemplateReplacements(assembleScaffoldXsl(state), state);
  }

  if (!templateCache[definition.templateFile]) {
    const response = await fetch(definition.templateFile);

    if (!response.ok) {
      throw new Error(`Failed to load template: ${definition.templateFile}`);
    }

    templateCache[definition.templateFile] = await response.text();
  }

  return applyTemplateReplacements(templateCache[definition.templateFile], state);
}

function syncPreviewSampleButtons() {
  previewSampleButtons.forEach((button) => {
    const isActive = button.dataset.previewSample === selectedPreviewSample;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

async function getSampleXml(sampleType = selectedPreviewSample) {
  const sampleDefinition = previewSampleDefinitions[sampleType] || previewSampleDefinitions.book;

  if (sampleXmlCache[sampleDefinition.file]) {
    return sampleXmlCache[sampleDefinition.file];
  }

  const response = await fetch(sampleDefinition.file);

  if (!response.ok) {
    throw new Error(`Failed to load ${sampleDefinition.label} sample XML`);
  }

  sampleXmlCache[sampleDefinition.file] = await response.text();
  return sampleXmlCache[sampleDefinition.file];
}

function applyLibraryNameToPreviewXml(xmlText, state) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(normalizeXmlForParsing(xmlText), 'application/xml');

  if (xmlDoc.querySelector('parsererror')) {
    return xmlText;
  }

  const libraryName = state.libraryName.trim() || 'Your Library';

  xmlDoc.querySelectorAll('*').forEach((node) => {
    if (node.children.length > 0) {
      return;
    }

    if (node.textContent?.trim() === 'California State University, Bakersfield') {
      node.textContent = libraryName;
    }
  });

  return new XMLSerializer().serializeToString(xmlDoc);
}

function applyCurrentDateToPreviewXml(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(normalizeXmlForParsing(xmlText), 'application/xml');

  if (xmlDoc.querySelector('parsererror')) {
    return xmlText;
  }

  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const today = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`;

  [
    'notification_data > borrowing_library_address > create_date',
    'notification_data > general_data > current_date',
    'notification_data > incoming_request > create_date',
    'notification_data > incoming_request > create_date_str',
    'notification_data > incoming_request > modification_date_str',
    'notification_data > incoming_request > print_slip_date',
    'notification_data > incoming_request > print_slip_date_dummy'
  ].forEach((selector) => {
    xmlDoc.querySelectorAll(selector).forEach((node) => {
      node.textContent = today;
    });
  });

  return new XMLSerializer().serializeToString(xmlDoc);
}

function formatPreviewPlaceholderLabel(token) {
  return token
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function cleanPreviewPlaceholderLabels(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const pattern = /@@([a-zA-Z0-9_]+)@@/g;
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    if (!node.nodeValue || !pattern.test(node.nodeValue)) {
      pattern.lastIndex = 0;
      return;
    }

    pattern.lastIndex = 0;
    node.nodeValue = node.nodeValue.replace(pattern, (_, token) => formatPreviewPlaceholderLabel(token));
  });
}

function showToast(message, tone = 'success') {
  let toast = document.querySelector('#app-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.toggle('is-error', tone === 'error');
  toast.classList.add('is-visible');

  window.clearTimeout(toastTimeoutId);
  toastTimeoutId = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2200);
}

async function copyPreviewToClipboard() {
  const text = preview.textContent.trim();

  if (!text) {
    showToast('Nothing to copy yet', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast('Successfully copied');
  } catch (error) {
    console.error(error);
    showToast('Copy failed', 'error');
  }
}

function downloadPreviewAsText() {
  const text = preview.textContent.trim();

  if (!text) {
    showToast('Nothing to download yet', 'error');
    return;
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'generated-xsl.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('Successfully downloaded');
}

async function renderTransformedOutput(xslText, state) {
  renderedPreview.innerHTML = '';

  if (!window.XSLTProcessor) {
    renderedPreview.textContent = 'This browser does not support in-page XSLT preview.';
    return;
  }

  try {
    let xmlText = await getSampleXml(selectedPreviewSample);
    xmlText = applyLibraryNameToPreviewXml(xmlText, state);
    xmlText = applyCurrentDateToPreviewXml(xmlText);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(normalizeXmlForParsing(xmlText), 'application/xml');
    const xslDoc = parser.parseFromString(normalizeXmlForParsing(xslText), 'application/xml');

    if (xmlDoc.querySelector('parsererror') || xslDoc.querySelector('parsererror')) {
      renderedPreview.textContent = 'The sample XML or generated XSL could not be parsed for preview.';
      return;
    }

    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDoc);
    const resultDocument = processor.transformToFragment(xmlDoc, document);

    renderedPreview.appendChild(resultDocument);
    cleanPreviewPlaceholderLabels(renderedPreview);
  } catch (error) {
    console.error(error);
    renderedPreview.textContent = `${previewSampleDefinitions[selectedPreviewSample]?.label || 'This'} sample preview is not available yet.`;
  }
}

async function render() {
  const state = readFormState();

  if (!state.letterType) {
    preview.textContent = '';
    renderedPreview.innerHTML = '';
    return;
  }

  preview.textContent = 'Loading template preview...';
  renderedPreview.textContent = 'Rendering sample output...';

  try {
    const xslText = await getTemplateText(state);
    preview.textContent = xslText;
    await renderTransformedOutput(xslText, state);
  } catch (error) {
    console.error(error);
    const fallbackXsl = assembleScaffoldXsl(state);
    preview.textContent = fallbackXsl;
    await renderTransformedOutput(fallbackXsl, state);
  }
  showToast('Successfully generated');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  render();
});

form.elements.letterType.addEventListener('change', () => {
  syncLetterSpecificQuestions();
  preview.textContent = '';
  renderedPreview.innerHTML = '';
});

form.elements.includeCreateDate.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

form.elements.includeLogo.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

previewSampleButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    selectedPreviewSample = button.dataset.previewSample || 'book';
    syncPreviewSampleButtons();

    const xslText = preview.textContent.trim();

    if (!xslText) {
      return;
    }

    renderedPreview.textContent = 'Rendering sample output...';
    await renderTransformedOutput(xslText, readFormState());
  });
});

copyXslButton.addEventListener('click', () => {
  copyPreviewToClipboard();
});

downloadXslButton.addEventListener('click', () => {
  downloadPreviewAsText();
});

resetButton.addEventListener('click', () => {
  window.requestAnimationFrame(() => {
    Object.entries(defaultState).forEach(([key, value]) => {
      const field = form.elements[key];

      if (!field) {
        return;
      }

      field.value = value;
    });

    syncLetterSpecificQuestions();
    preview.textContent = '';
    renderedPreview.innerHTML = '';
  });
});

syncLetterSpecificQuestions();
syncPreviewSampleButtons();
