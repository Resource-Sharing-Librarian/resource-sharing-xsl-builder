const form = document.querySelector('#builder-form');
const preview = document.querySelector('#xsl-preview');
const renderedPreview = document.querySelector('#rendered-preview');
const resetButton = document.querySelector('#reset-button');
const letterSpecificQuestions = document.querySelector('#letter-specific-questions');
const letterQuestionGroups = Array.from(document.querySelectorAll('[data-letter-question]'));
const dependentQuestionGroups = Array.from(document.querySelectorAll('[data-dependent-question]'));
const templateCache = {};
let sampleXmlCache = '';

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
}

function removeSectionByPattern(templateText, pattern) {
  return templateText.replace(pattern, '');
}

function applyLabelChoice(templateText, state) {
  const shippingPattern = /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 10B .* SHIPPING LABEL\r?\n[ \t]*NOTE: Use this section if the respondent says they want a shipping label\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 10B .* SHIPPING LABEL ===== -->[^\S\r\n]*/;
  const returnPattern = /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 10B .* SHIPPING LABEL \(SWAPPED ADDRESSES\)\r?\n[ \t]*NOTE: Use this if the respondent says they want a return label\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 10B .* SHIPPING LABEL \(SWAPPED\) ===== -->[^\S\r\n]*/;

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
  let output = templateText.replaceAll('@@LOGO_URL@@', state.logoUrl || '');

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

async function getSampleXml() {
  if (sampleXmlCache) {
    return sampleXmlCache;
  }

  const response = await fetch('./sample-input.xml');

  if (!response.ok) {
    throw new Error('Failed to load sample-input.xml');
  }

  sampleXmlCache = await response.text();
  return sampleXmlCache;
}

async function renderTransformedOutput(xslText) {
  renderedPreview.innerHTML = '';

  if (!window.XSLTProcessor) {
    renderedPreview.textContent = 'This browser does not support in-page XSLT preview.';
    return;
  }

  try {
    const xmlText = await getSampleXml();
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
  } catch (error) {
    console.error(error);
    renderedPreview.textContent = 'Rendered preview is not available yet for this template.';
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
    await renderTransformedOutput(xslText);
  } catch (error) {
    console.error(error);
    const fallbackXsl = assembleScaffoldXsl(state);
    preview.textContent = fallbackXsl;
    await renderTransformedOutput(fallbackXsl);
  }
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
