const form = document.querySelector('#builder-form');
const preview = document.querySelector('#xsl-preview');
const renderedPreview = document.querySelector('#rendered-preview');
const resetButton = document.querySelector('#reset-button');
const copyXslButton = document.querySelector('#copy-xsl-button');
const downloadXslButton = document.querySelector('#download-xsl-button');
const previewSampleButtons = Array.from(document.querySelectorAll('[data-preview-sample]'));
const metadataSelectAllButtons = Array.from(document.querySelectorAll('.metadata-select-all'));
const letterSpecificQuestions = document.querySelector('#letter-specific-questions');
const letterQuestionGroups = Array.from(document.querySelectorAll('[data-letter-question]'));
const dependentQuestionGroups = Array.from(document.querySelectorAll('[data-dependent-question]'));
const templateCache = {};
const sampleXmlCache = {};
let toastTimeoutId = null;
let selectedPreviewSample = 'book';
const PREVIEW_PAGE_WIDTH = 816;
const PREVIEW_PAGE_HEIGHT = 1056;
const PREVIEW_PAGE_MARGIN = 48;
const PREVIEW_CONTENT_WIDTH = PREVIEW_PAGE_WIDTH - (PREVIEW_PAGE_MARGIN * 2);
const PREVIEW_CONTENT_HEIGHT = PREVIEW_PAGE_HEIGHT - (PREVIEW_PAGE_MARGIN * 2);
const PREVIEW_GROUP_QUALIFIER_BARCODE_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="224" height="104" viewBox="0 0 224 104">
  <rect width="224" height="104" fill="#fff"/>
  <g fill="#111">
    <rect x="12" y="10" width="2" height="66"/>
    <rect x="16" y="10" width="1" height="66"/>
    <rect x="20" y="10" width="3" height="66"/>
    <rect x="26" y="10" width="2" height="66"/>
    <rect x="31" y="10" width="1" height="66"/>
    <rect x="35" y="10" width="4" height="66"/>
    <rect x="42" y="10" width="2" height="66"/>
    <rect x="47" y="10" width="1" height="66"/>
    <rect x="50" y="10" width="3" height="66"/>
    <rect x="56" y="10" width="2" height="66"/>
    <rect x="61" y="10" width="1" height="66"/>
    <rect x="65" y="10" width="4" height="66"/>
    <rect x="72" y="10" width="2" height="66"/>
    <rect x="76" y="10" width="1" height="66"/>
    <rect x="80" y="10" width="3" height="66"/>
    <rect x="86" y="10" width="2" height="66"/>
    <rect x="91" y="10" width="1" height="66"/>
    <rect x="95" y="10" width="4" height="66"/>
    <rect x="102" y="10" width="2" height="66"/>
    <rect x="107" y="10" width="1" height="66"/>
    <rect x="110" y="10" width="3" height="66"/>
    <rect x="116" y="10" width="2" height="66"/>
    <rect x="121" y="10" width="1" height="66"/>
    <rect x="125" y="10" width="4" height="66"/>
    <rect x="132" y="10" width="2" height="66"/>
    <rect x="136" y="10" width="1" height="66"/>
    <rect x="140" y="10" width="3" height="66"/>
    <rect x="146" y="10" width="2" height="66"/>
    <rect x="151" y="10" width="1" height="66"/>
    <rect x="155" y="10" width="4" height="66"/>
    <rect x="162" y="10" width="2" height="66"/>
    <rect x="167" y="10" width="1" height="66"/>
    <rect x="170" y="10" width="3" height="66"/>
    <rect x="176" y="10" width="2" height="66"/>
    <rect x="181" y="10" width="1" height="66"/>
    <rect x="185" y="10" width="4" height="66"/>
    <rect x="192" y="10" width="2" height="66"/>
    <rect x="197" y="10" width="1" height="66"/>
    <rect x="200" y="10" width="3" height="66"/>
    <rect x="206" y="10" width="2" height="66"/>
  </g>
  <text x="112" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#111">01MCU0000001</text>
</svg>
`)}`;
const PREVIEW_INTERNAL_ID_BARCODE_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="224" height="104" viewBox="0 0 224 104">
  <rect width="224" height="104" fill="#fff"/>
  <g fill="#111">
    <rect x="12" y="10" width="2" height="66"/>
    <rect x="16" y="10" width="1" height="66"/>
    <rect x="20" y="10" width="3" height="66"/>
    <rect x="26" y="10" width="2" height="66"/>
    <rect x="31" y="10" width="1" height="66"/>
    <rect x="35" y="10" width="4" height="66"/>
    <rect x="42" y="10" width="2" height="66"/>
    <rect x="47" y="10" width="1" height="66"/>
    <rect x="50" y="10" width="3" height="66"/>
    <rect x="56" y="10" width="2" height="66"/>
    <rect x="61" y="10" width="1" height="66"/>
    <rect x="65" y="10" width="4" height="66"/>
    <rect x="72" y="10" width="2" height="66"/>
    <rect x="76" y="10" width="1" height="66"/>
    <rect x="80" y="10" width="3" height="66"/>
    <rect x="86" y="10" width="2" height="66"/>
    <rect x="91" y="10" width="1" height="66"/>
    <rect x="95" y="10" width="4" height="66"/>
    <rect x="102" y="10" width="2" height="66"/>
    <rect x="107" y="10" width="1" height="66"/>
    <rect x="110" y="10" width="3" height="66"/>
    <rect x="116" y="10" width="2" height="66"/>
    <rect x="121" y="10" width="1" height="66"/>
    <rect x="125" y="10" width="4" height="66"/>
    <rect x="132" y="10" width="2" height="66"/>
    <rect x="136" y="10" width="1" height="66"/>
    <rect x="140" y="10" width="3" height="66"/>
    <rect x="146" y="10" width="2" height="66"/>
    <rect x="151" y="10" width="1" height="66"/>
    <rect x="155" y="10" width="4" height="66"/>
    <rect x="162" y="10" width="2" height="66"/>
    <rect x="167" y="10" width="1" height="66"/>
    <rect x="170" y="10" width="3" height="66"/>
    <rect x="176" y="10" width="2" height="66"/>
    <rect x="181" y="10" width="1" height="66"/>
    <rect x="185" y="10" width="4" height="66"/>
    <rect x="192" y="10" width="2" height="66"/>
    <rect x="197" y="10" width="1" height="66"/>
    <rect x="200" y="10" width="3" height="66"/>
    <rect x="206" y="10" width="2" height="66"/>
  </g>
  <text x="112" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#111">000000000000001</text>
</svg>
`)}`;

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
    noteAreaType: form.elements.noteAreaType.value,
    metadataOptions: Array.from(form.querySelectorAll('input[name="metadataOptions"]:checked')).map((input) => input.value)
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function getShippingLabelBlockPattern() {
  return /[ \t]*<table class="shippingLabel"[\s\S]*?<!-- ===== END SECTION 10B [^\r\n]*SHIPPING LABEL ===== -->[^\S\r\n]*/;
}

function getReturnLabelBlockPattern() {
  return /[ \t]*<table class="shippingLabel"[\s\S]*?<!-- ===== END SECTION 10B - SHIPPING LABEL \(SWAPPED\) ===== -->[^\S\r\n]*/;
}

function findAllLabelTableStarts(templateText) {
  return [...templateText.matchAll(/<table class="shippingLabel"/g)].map((match) => match.index);
}

function findLabelBlockFromStart(templateText, startIndex) {
  if (startIndex === -1 || startIndex == null) {
    return null;
  }

  const endCommentPattern = /<!-- ===== END SECTION 10B[^\n]*SHIPPING LABEL[^\n]*-->/g;
  endCommentPattern.lastIndex = startIndex;
  const endMatch = endCommentPattern.exec(templateText);

  if (!endMatch) {
    return null;
  }

  const blockEnd = endMatch.index + endMatch[0].length;
  return {
    start: startIndex,
    end: blockEnd,
    text: templateText.slice(startIndex, blockEnd)
  };
}

function removeLabelBlockAtIndex(templateText, startIndex) {
  const block = findLabelBlockFromStart(templateText, startIndex);

  if (!block) {
    return templateText;
  }

  return `${templateText.slice(0, block.start)}${templateText.slice(block.end)}`;
}

function applySelectedLabelChoice(templateText, state) {
  const labelStarts = findAllLabelTableStarts(templateText);

  if (state.labelChoice === 'shipping-label') {
    return removeLabelBlockAtIndex(templateText, labelStarts[1]);
  }

  if (state.labelChoice === 'return-label') {
    return removeLabelBlockAtIndex(templateText, labelStarts[0]);
  }

  if (state.labelChoice === 'both-labels') {
    return templateText;
  }

  return removeLabelBlockAtIndex(
    removeLabelBlockAtIndex(templateText, labelStarts[1]),
    labelStarts[0]
  );
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

function applyMetadataSelection(templateText, state) {
  const allMetadataOptions = [
    'title',
    'author',
    'publication-date',
    'volume',
    'issue',
    'pages',
    'publisher',
    'place-of-publication',
    'oclc-number',
    'borrower-reference',
    'request-note',
    'requester-email',
    'edition',
    'isbn',
    'shelving-location-for-item',
    'chapter-title',
    'chapter-author',
    'chapter-number',
    'journal-title',
    'article-title',
    'issn'
  ];
  const selectedMetadata = new Set(state.metadataOptions || []);
  let output = templateText;

  allMetadataOptions.forEach((option) => {
    if (selectedMetadata.has(option)) {
      return;
    }

    const pattern = new RegExp(
      `[ \\t]*<!-- BEGIN METADATA: ${escapeRegex(option)} -->[\\s\\S]*?<!-- END METADATA: ${escapeRegex(option)} -->[^\\S\\r\\n]*`,
      'g'
    );

    output = removeSectionByPattern(output, pattern);
  });

  return output;
}

function applyLayoutClass(templateText, state) {
  return templateText.replaceAll('@@LAYOUT_CLASS@@', shouldUseSectionSplitLayout(state) ? 'section-split-layout' : '');
}

function shouldUseSectionSplitLayout(state) {
  const splitEligibleMetadata = new Set([
    'title',
    'author',
    'publication-date',
    'volume',
    'issue',
    'pages',
    'publisher',
    'place-of-publication',
    'oclc-number',
    'borrower-reference',
    'request-note',
    'requester-email',
    'edition',
    'isbn',
    'shelving-location-for-item'
  ]);
  const metadataCount = (state.metadataOptions || []).filter((option) => splitEligibleMetadata.has(option)).length;
  const hasCheckboxConditionReport = state.noteAreaType === 'checkboxes';
  return state.letterType === 'pull-slip-letter'
    && state.labelChoice !== ''
    && state.labelChoice !== 'no-label'
    && (state.labelChoice === 'both-labels' || metadataCount >= 8 || hasCheckboxConditionReport);
}

function shouldUseDigitalSectionSplitLayout(state) {
  const digitalSplitEligibleMetadata = new Set([
    'title',
    'author',
    'publication-date',
    'volume',
    'issue',
    'pages',
    'publisher',
    'place-of-publication',
    'oclc-number',
    'borrower-reference',
    'request-note',
    'journal-title',
    'article-title',
    'issn',
    'chapter-number',
    'chapter-title',
    'chapter-author'
  ]);

  const metadataCount = (state.metadataOptions || []).filter((option) => digitalSplitEligibleMetadata.has(option)).length;

  return state.letterType === 'pull-slip-letter' && metadataCount > 5;
}

function extractSelectedPhysicalLabelBlock(templateText) {
  const blocks = findAllLabelTableStarts(templateText)
    .map((startIndex) => findLabelBlockFromStart(templateText, startIndex))
    .filter(Boolean);

  if (!blocks.length) {
    return {
      labelBlocks: [],
      templateWithoutLabel: templateText
    };
  }

  return {
    labelBlocks: blocks.map((block) => block.text),
    templateWithoutLabel: blocks
      .slice()
      .sort((a, b) => b.start - a.start)
      .reduce((output, block) => `${output.slice(0, block.start)}${output.slice(block.end)}`, templateText)
  };
}

function extractOptionalNoteAreaBlock(templateText) {
  const notePattern = /[ \t]*<!-- BEGIN OPTIONAL NOTE AREA -->[\s\S]*?<!-- END OPTIONAL NOTE AREA -->[^\S\r\n]*/;
  const match = templateText.match(notePattern);

  if (!match) {
    return {
      noteBlock: '',
      templateWithoutNote: templateText
    };
  }

  return {
    noteBlock: match[0],
    templateWithoutNote: templateText.replace(notePattern, '')
  };
}

function buildSplitSideNoteBlock(state) {
  if (state.noteAreaType === 'none') {
    return '';
  }

  if (state.noteAreaType === 'checkboxes') {
    return [
      '                          <div style="width:350px; min-width:350px; max-width:350px;">',
      '                            <b><span style="text-decoration:underline;">Item Condition Report:</span></b>',
      '                          </div>',
      '                          <table cellspacing="0" cellpadding="5" border="0" style="width:350px; min-width:350px; max-width:350px; table-layout:fixed; border-collapse:collapse;">',
      '                            <tr>',
      '                              <td><b><span style="font-size:18px;">&#9633;</span> Binding Issues</b></td>',
      '                              <td><b><span style="font-size:18px;">&#9633;</span> Writing</b></td>',
      '                            </tr>',
      '                            <tr>',
      '                              <td><b><span style="font-size:18px;">&#9633;</span> Cover/Spine Issues</b></td>',
      '                              <td><b><span style="font-size:18px;">&#9633;</span> Liquid/Stained</b></td>',
      '                            </tr>',
      '                            <tr>',
      '                              <td><b><span style="font-size:18px;">&#9633;</span> Missing CD/DVD</b></td>',
      '                              <td><b><span style="font-size:18px;">&#9633;</span> Other</b></td>',
      '                            </tr>',
      '                          </table>',
      '                          <div style="height:12px;"></div>'
    ].join('\n');
  }

  return [
    '                          <div style="width:350px; min-width:350px; max-width:350px;">',
    '                            <b>Note:</b>',
    '                            <div style="display:block; width:350px; border-bottom:1px solid #000; height:14px;"></div>',
    '                          </div>',
    '                          <div style="height:12px;"></div>'
  ].join('\n');
}

function normalizeMovedLabelBlock(labelBlock) {
  if (!labelBlock) {
    return '';
  }

  return labelBlock
    .replace(/<tr>\s*<tr>/g, '<tr>')
    .replace(/<\/tr>\s*<\/tr>/g, '</tr>')
    .replace(
      /<table class="shippingLabel"/,
      '<table class="shippingLabel" style="width:336px; min-width:336px; max-width:336px; table-layout:fixed; border-collapse:collapse;"'
    )
    .replace(
      /<td style="font-size:12px;">/,
      '<td style="font-size:12px; overflow-wrap:normal; word-break:normal; hyphens:none;">'
    )
    .replaceAll(
      'style="font-size:16px;width:350px"',
      'style="font-size:16px;width:336px; overflow-wrap:normal; word-break:normal; hyphens:none;"'
    )
    .replaceAll(
      'style="font-size:18px;width:350px"',
      'style="font-size:18px;width:336px; overflow-wrap:normal; word-break:normal; hyphens:none;"'
    );
}

function buildMovedPhysicalLabelBlocks(state, labelBlocks) {
  if (!labelBlocks.length) {
    return '';
  }

  const normalizedBlocks = labelBlocks.map((labelBlock) => normalizeMovedLabelBlock(labelBlock));

  if (state.labelChoice === 'both-labels' && normalizedBlocks.length >= 2) {
    return [
      '<div style="width:336px; min-width:336px; max-width:336px; font-weight:bold;">---Shipping Label---</div>',
      '<div style="height:6px;"></div>',
      normalizedBlocks[0],
      '<div style="height:28px;"></div>',
      '<div style="width:336px; min-width:336px; max-width:336px; font-weight:bold;">---Return Label---</div>',
      '<div style="height:6px;"></div>',
      normalizedBlocks[1]
    ].join('\n');
  }

  if (state.labelChoice === 'shipping-label') {
    return [
      '<div style="width:336px; min-width:336px; max-width:336px; font-weight:bold;">---Shipping Label---</div>',
      '<div style="height:6px;"></div>',
      normalizedBlocks[0]
    ].join('\n');
  }

  if (state.labelChoice === 'return-label') {
    return [
      '<div style="width:336px; min-width:336px; max-width:336px; font-weight:bold;">---Return Label---</div>',
      '<div style="height:6px;"></div>',
      normalizedBlocks[0]
    ].join('\n');
  }

  return normalizedBlocks.join('\n');
}

function extractSection08Block(templateText) {
  const pattern = /[ \t]*<!-- ===== BEGIN SECTION 08 - PARTNER\/POD\/LOGO ===== -->[\s\S]*?<!-- ===== END SECTION 08 - PARTNER\/POD\/LOGO ===== -->[^\S\r\n]*/;
  const match = templateText.match(pattern);

  if (!match) {
    return {
      sectionBlock: '',
      templateWithoutSection: templateText
    };
  }

  return {
    sectionBlock: match[0],
    templateWithoutSection: templateText.replace(pattern, '')
  };
}

function wrapSection08ForDigital(sectionBlock) {
  if (!sectionBlock) {
    return '';
  }

  return [
    `                <xsl:if test="notification_data/incoming_request/format != 'PHYSICAL'">`,
    sectionBlock.trim(),
    '                </xsl:if>'
  ].join('\n');
}

function extractPhysicalSectionBlock(templateText) {
  const pattern = /[ \t]*<!-- ===== BEGIN SECTION 10 - PHYSICAL ===== -->[\s\S]*?<!-- ===== END SECTION 10 - PHYSICAL ===== -->[^\S\r\n]*/;
  const match = templateText.match(pattern);

  if (!match) {
    return {
      physicalSectionBlock: '',
      templateWithoutPhysicalSection: templateText
    };
  }

  return {
    physicalSectionBlock: match[0],
    templateWithoutPhysicalSection: templateText.replace(pattern, '')
  };
}

function extractDigitalSectionBlock(templateText) {
  const pattern = /[ \t]*<!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->[\s\S]*?<!-- ===== END SECTION 11 - DIGITAL ===== -->[^\S\r\n]*/;
  const match = templateText.match(pattern);

  if (!match) {
    return {
      digitalSectionBlock: '',
      templateWithoutDigitalSection: templateText
    };
  }

  return {
    digitalSectionBlock: match[0],
    templateWithoutDigitalSection: templateText.replace(pattern, '')
  };
}

function extractMarkedBlock(text, beginMarker, endMarker) {
  const start = text.indexOf(beginMarker);

  if (start === -1) {
    return {
      block: '',
      textWithoutBlock: text
    };
  }

  const end = text.indexOf(endMarker, start);

  if (end === -1) {
    return {
      block: '',
      textWithoutBlock: text
    };
  }

  const blockEnd = end + endMarker.length;

  return {
    block: text.slice(start, blockEnd),
    textWithoutBlock: `${text.slice(0, start)}${text.slice(blockEnd)}`
  };
}

function stripDigitalOuterWrapper(digitalSectionBlock) {
  return digitalSectionBlock
    .replace(/^\s*<!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->\s*/, '')
    .replace(/^\s*<xsl:if test="notification_data\/incoming_request\/format = 'DIGITAL'">\s*/, '')
    .replace(/\s*<!-- ===== END SECTION 11 - DIGITAL ===== -->\s*$/, '')
    .replace(/\s*<\/xsl:if>\s*$/, '');
}

function stripDigitalArticleWrapper(articleBlock) {
  return articleBlock
    .replace(/^\s*<!-- ===== END SECTION 10 - PHYSICAL ===== -->\s*/, '')
    .replace(/^\s*<!-- [=\s]*SECTION 11A - DIGITAL ARTICLE[\s\S]*?-->\s*/, '')
    .replace(/^\s*<xsl:if test="notification_data\/metadata\/material_type = 'Article'">\s*/, '')
    .replace(/\s*<!-- ===== END SECTION 11A - DIGITAL ARTICLE ===== -->\s*$/, '')
    .replace(/\s*<\/xsl:if>\s*$/, '');
}

function stripDigitalChapterWrapper(chapterBlock) {
  return chapterBlock
    .replace(/^\s*<!-- [=\s]*SECTION 11B - DIGITAL BOOK\/CHAPTER[\s\S]*?-->\s*/, '')
    .replace(/^\s*<xsl:if test="notification_data\/metadata\/material_type = 'Book'">\s*/, '')
    .replace(/\s*<!-- ===== END SECTION 11B - DIGITAL BOOK\/CHAPTER ===== -->\s*$/, '')
    .replace(/\s*<\/xsl:if>\s*$/, '');
}

function stripDigitalCopyrightWrapper(copyrightBlock) {
  return copyrightBlock
    .replace(/^\s*<!-- [=\s]*SECTION 11C - COPYRIGHT NOTICE[\s\S]*?-->\s*/, '')
    .replace(/\s*<!-- ===== END SECTION 11C - COPYRIGHT NOTICE ===== -->\s*$/, '');
}

function splitDigitalInternalBarcode(innerBlock) {
  const pattern = /(\s*<xsl:call-template name="spacer" \/>\s*<xsl:call-template name="spacer" \/>\s*<tr><td><img src="cid:resource_sharing_request_id\.png" \/><\/td><\/tr>\s*)$/;
  const match = innerBlock.match(pattern);

  if (!match) {
    return {
      leftContent: innerBlock.trim(),
      barcodeBlock: ''
    };
  }

  return {
    leftContent: innerBlock.replace(pattern, '').trim(),
    barcodeBlock: match[1].trim()
  };
}

function applyDigitalSectionSplitLayout(templateText, state) {
  if (!shouldUseDigitalSectionSplitLayout(state)) {
    return templateText;
  }

  const { digitalSectionBlock, templateWithoutDigitalSection } = extractDigitalSectionBlock(templateText);

  if (!digitalSectionBlock) {
    return templateText;
  }

  const digitalInner = stripDigitalOuterWrapper(digitalSectionBlock);
  const articleExtract = extractMarkedBlock(
    digitalInner,
    '<!-- ========================================================\r\n                         SECTION 11A - DIGITAL ARTICLE',
    '<!-- ===== END SECTION 11A - DIGITAL ARTICLE ===== -->'
  );

  if (!articleExtract.block) {
    return templateText;
  }

  const chapterExtract = extractMarkedBlock(
    articleExtract.textWithoutBlock,
    '<!-- ========================================================\r\n                         SECTION 11B - DIGITAL BOOK/CHAPTER',
    '<!-- ===== END SECTION 11B - DIGITAL BOOK/CHAPTER ===== -->'
  );

  const copyrightExtract = extractMarkedBlock(
    chapterExtract.textWithoutBlock,
    '<!-- ========================================================\r\n                         SECTION 11C - COPYRIGHT NOTICE',
    '<!-- ===== END SECTION 11C - COPYRIGHT NOTICE ===== -->'
  );

  if (!chapterExtract.block || !copyrightExtract.block) {
    return templateText;
  }

  const articleInner = stripDigitalArticleWrapper(articleExtract.block);
  const chapterInner = stripDigitalChapterWrapper(chapterExtract.block);
  const copyrightInner = stripDigitalCopyrightWrapper(copyrightExtract.block).trim();

  const articleSplit = splitDigitalInternalBarcode(articleInner);
  const chapterSplit = splitDigitalInternalBarcode(chapterInner);

  const buildDigitalRightBlock = (barcodeBlock) => [
    '                      <div style="position:absolute; top:0; left:366px; width:336px !important; min-width:336px; max-width:336px; vertical-align:top; text-align:left;">',
    '                        <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:336px; max-width:336px; table-layout:fixed;">',
    barcodeBlock || '',
    '                          <tr><td style="height:12px;"></td></tr>',
    copyrightInner,
    '                        </table>',
    '                      </div>'
  ].filter(Boolean).join('\n');

  const buildDigitalSplitBlock = (testExpression, leftContent, barcodeBlock) => [
    `                    <xsl:if test="${testExpression}">`,
    '                      <div style="position:relative; width:702px !important; max-width:702px !important; margin:0;">',
    '                        <div style="width:336px !important; min-width:336px; max-width:336px; margin-right:366px; vertical-align:top; text-align:left;">',
    '                          <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:336px; max-width:336px; table-layout:fixed;">',
    leftContent,
    '                          </table>',
    '                        </div>',
    buildDigitalRightBlock(barcodeBlock),
    '                      </div>',
    '                    </xsl:if>'
  ].join('\n');

  const rebuiltDigitalBlock = [
    '                  <!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->',
    `                  <xsl:if test="notification_data/incoming_request/format = 'DIGITAL'">`,
    buildDigitalSplitBlock("notification_data/metadata/material_type = 'Article'", articleSplit.leftContent, articleSplit.barcodeBlock),
    '',
    buildDigitalSplitBlock("notification_data/metadata/material_type = 'Book'", chapterSplit.leftContent, chapterSplit.barcodeBlock),
    '                  </xsl:if>',
    '                  <!-- ===== END SECTION 11 - DIGITAL ===== -->'
  ].join('\n');

  return templateWithoutDigitalSection.replace(
    '                </table>\n                <!-- ===== END SECTION 09 - MAIN CONTENT TABLE ===== -->',
    `${rebuiltDigitalBlock}\n\n                </table>\n                <!-- ===== END SECTION 09 - MAIN CONTENT TABLE ===== -->`
  );
}

function stripPhysicalSectionWrapper(physicalSectionBlock) {
  return physicalSectionBlock
    .replace(/^\s*<!-- ===== BEGIN SECTION 10 - PHYSICAL ===== -->\s*/, '')
    .replace(/^\s*<xsl:if test="notification_data\/incoming_request\/format = 'PHYSICAL'">\s*/, '')
    .replace(/\s*<\/xsl:if>\s*$/, '')
    .replace(/\s*<!-- ===== END SECTION 10 - PHYSICAL ===== -->\s*$/, '');
}

function trimPhysicalContentForLeftCell(innerPhysicalContent) {
  let output = innerPhysicalContent.replace(/\s*<!-- ===== END SECTION 10 - PHYSICAL ===== -->\s*$/, '');
  const section10bIndex = output.indexOf('SECTION 10B');

  if (section10bIndex !== -1) {
    const commentStart = output.lastIndexOf('<!--', section10bIndex);

    if (commentStart !== -1) {
      output = output.slice(0, commentStart);
    }
  }

  return output.trim();
}

function extractPhysicalLabelBlock(templateText) {
  const blockPatterns = [
    /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 10B [â€”-] SHIPPING LABEL\r?\n[ \t]*NOTE: Addresses MUST remain full; do not truncate\.\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 10B [â€”-] SHIPPING LABEL ===== -->[^\S\r\n]*/,
    /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 10B [â€”-] Return LABEL ?\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 10B [â€”-] SHIPPING LABEL \(SWAPPED\) ===== -->[^\S\r\n]*/
  ];

  for (const pattern of blockPatterns) {
    const match = templateText.match(pattern);
    if (match) {
      return {
        labelBlock: match[0],
        templateWithoutLabel: templateText.replace(pattern, '')
      };
    }
  }

  return {
    labelBlock: '',
    templateWithoutLabel: templateText
  };
}

function applySectionSplitLayout(templateText, state) {
  if (!shouldUseSectionSplitLayout(state)) {
    return templateText.replaceAll('@@HEADER_ADJACENT_LABEL_CELL@@', '');
  }

  const { sectionBlock, templateWithoutSection } = extractSection08Block(templateText);
  const { physicalSectionBlock, templateWithoutPhysicalSection } = extractPhysicalSectionBlock(templateWithoutSection);

  if (!sectionBlock || !physicalSectionBlock) {
    return templateText.replaceAll('@@HEADER_ADJACENT_LABEL_CELL@@', '');
  }

  const { labelBlocks, templateWithoutLabel } = extractSelectedPhysicalLabelBlock(physicalSectionBlock);
  const { templateWithoutNote } = extractOptionalNoteAreaBlock(templateWithoutLabel);
  let output = templateWithoutPhysicalSection;

  output = output.replace(
    '<div class="rsSlipOuter">',
    '<div class="rsSlipOuter" style="width:702px !important; max-width:702px !important; overflow:visible;">'
  );

  output = output.replace(
    '<div class="rsSlip rsSlipInner">',
    '<div class="rsSlip rsSlipInner" style="width:702px !important; max-width:702px !important;">'
  );

  output = output.replace(
    /(<div class="messageBody">\s*<table role="presentation" border="0" cellspacing="0" cellpadding="0" style=")width:350px; max-width:350px; border-collapse:collapse; table-layout:fixed;(")/,
    '$1width:702px !important; max-width:702px !important; border-collapse:collapse; table-layout:fixed;$2'
  );

  output = output.replace(
    /(<td class="split-layout-main-cell" style=")width:350px; border:0; padding:0; vertical-align:top;(")/,
    '$1width:702px !important; border:0; padding:0; vertical-align:top;$2 colspan="2"'
  );

  output = output.replace(
    /(<!-- ===== BEGIN SECTION 09 - MAIN CONTENT TABLE ===== -->\s*<table role="presentation" cellspacing="0" cellpadding="2" border="0" style=")width:350px; max-width:350px; table-layout:fixed;(")/,
    '$1width:702px !important; max-width:702px !important; table-layout:fixed;$2'
  );

  output = output.replace(
    '<td style="width:350px; border:0; padding:0;" colspan="2">',
    '<td style="width:702px !important; border:0; padding:0;" colspan="2">'
  );

  const sideNoteBlock = buildSplitSideNoteBlock(state);
  const movedLabelBlocks = buildMovedPhysicalLabelBlocks(state, labelBlocks);
  const sideParts = [sideNoteBlock, movedLabelBlocks].filter(Boolean).map((part) => part.trim()).join('\n');
  const sideColumnBlock = [
    '<div style="width:336px; min-width:336px; max-width:336px; margin:0; text-align:left;">',
    sideParts,
    '</div>'
  ].join('\n');

  if (!sideParts) {
    return output.replaceAll('@@HEADER_ADJACENT_LABEL_CELL@@', '');
  }

  const leftPhysicalContent = trimPhysicalContentForLeftCell(stripPhysicalSectionWrapper(templateWithoutNote));
  const digitalSectionBlock = wrapSection08ForDigital(sectionBlock);

  const rebuiltPhysicalBlock = [
    `                  <xsl:if test="notification_data/incoming_request/format = 'PHYSICAL'">`,
    '                    <div style="position:relative; width:702px !important; max-width:702px !important; margin:0;">',
    '                      <div style="width:336px !important; min-width:336px; max-width:336px; margin-right:366px; vertical-align:top; text-align:left;">',
    sectionBlock.trim(),
    '                          <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:336px; max-width:336px; table-layout:fixed;">',
    leftPhysicalContent,
    '                          </table>',
    '                      </div>',
    '                      <div style="position:absolute; top:0; left:366px; width:336px !important; min-width:336px; max-width:336px; vertical-align:top; text-align:left;">',
    sideColumnBlock,
    '                      </div>',
    '                    </div>',
    '                  </xsl:if>'
  ].join('\n');

  output = output.replace(
    '                  <!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->',
    `${digitalSectionBlock}\n\n${rebuiltPhysicalBlock}\n\n                  <!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->`
  );

  output = output.replaceAll('@@HEADER_ADJACENT_LABEL_CELL@@', '');

  return output;
}

function applyTemplateReplacements(templateText, state) {
  const logoUrl = state.includeLogo === 'yes' ? state.logoUrl : '';
  let output = templateText.replaceAll('@@LOGO_URL@@', logoUrl || '');

  if (state.letterType === 'pull-slip-letter') {
    output = applySelectedLabelChoice(output, state);
    output = applyCreateDateChoice(output, state);
    output = applyCreateDateFormat(output, state);
    output = applyNoteAreaChoice(output, state);
    output = applyMetadataSelection(output, state);
    output = applySectionSplitLayout(output, state);
    output = applyDigitalSectionSplitLayout(output, state);
  }

  output = applyLayoutClass(output, state);

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
    const response = await fetch(definition.templateFile, { cache: 'no-store' });

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

  const response = await fetch(sampleDefinition.file, { cache: 'no-store' });

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
  const acronymWords = new Set(['oclc', 'issn', 'isbn']);
  return token
    .split('_')
    .filter(Boolean)
    .map((word) => (acronymWords.has(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
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

function replacePreviewBarcodeImages(root) {
  root.querySelectorAll('img').forEach((image) => {
    const altText = (image.getAttribute('alt') || '').trim();
    const src = image.getAttribute('src') || '';
    const isInternalIdBarcode = src.includes('resource_sharing_request_id');
    const isPreviewBarcode = altText === 'group_qualifier'
      || altText === 'externalId'
      || src.includes('group_qualifier')
      || src.includes('externalId')
      || src.includes('resource_sharing_request_id');

    if (!isPreviewBarcode) {
      return;
    }

    image.setAttribute('src', isInternalIdBarcode ? PREVIEW_INTERNAL_ID_BARCODE_SRC : PREVIEW_GROUP_QUALIFIER_BARCODE_SRC);
    image.setAttribute('alt', isInternalIdBarcode ? 'preview internal id barcode' : 'preview barcode');
    image.setAttribute('width', '224');
    image.setAttribute('height', '104');
    image.style.width = '224px';
    image.style.maxWidth = '224px';
    image.style.height = '104px';
    image.style.display = 'block';
  });
}

function buildPaginatedPreview(container) {
  const sourceMarkup = container.innerHTML.trim();
  const hasSectionSplitLayout = container.classList.contains('section-split-layout');

  if (!sourceMarkup) {
    return;
  }

  const measureHost = document.createElement('div');
  measureHost.className = 'preview-measure-host';
  const measurePage = document.createElement('div');
  measurePage.className = 'preview-measure-page';
  const measureContent = document.createElement('div');
  measureContent.className = 'preview-measure-content';
  measureContent.style.width = `${PREVIEW_CONTENT_WIDTH}px`;
  measureContent.innerHTML = sourceMarkup;
  measurePage.appendChild(measureContent);
  measureHost.appendChild(measurePage);
  document.body.appendChild(measureHost);

  const availableWidth = Math.max(320, renderedPreview.clientWidth - 24);
  const scale = Math.min(1, availableWidth / PREVIEW_PAGE_WIDTH);
  const totalHeight = Math.max(measureContent.scrollHeight, PREVIEW_CONTENT_HEIGHT);
  const pageCount = Math.max(1, Math.ceil(totalHeight / PREVIEW_CONTENT_HEIGHT));

  document.body.removeChild(measureHost);

  container.innerHTML = '';
  container.classList.add('is-paginated');

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = document.createElement('div');
    page.className = 'preview-paper';
    page.style.width = `${PREVIEW_PAGE_WIDTH * scale}px`;
    page.style.height = `${PREVIEW_PAGE_HEIGHT * scale}px`;

    const viewport = document.createElement('div');
    viewport.className = 'preview-paper-viewport';

    const content = document.createElement('div');
    content.className = 'preview-paper-content';
    content.classList.toggle('section-split-layout', hasSectionSplitLayout);
    content.style.width = `${PREVIEW_CONTENT_WIDTH}px`;
    content.style.transform = `translateY(-${pageIndex * PREVIEW_CONTENT_HEIGHT}px) scale(${scale})`;
    content.innerHTML = sourceMarkup;
    viewport.appendChild(content);
    page.appendChild(viewport);
    container.appendChild(page);
  }
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
  renderedPreview.classList.toggle('section-split-layout', shouldUseSectionSplitLayout(state));

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
    replacePreviewBarcodeImages(renderedPreview);
    buildPaginatedPreview(renderedPreview);
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
    showToast(`${previewSampleDefinitions[selectedPreviewSample]?.label || 'Book'} XML Selected`);

    const xslText = preview.textContent.trim();

    if (!xslText) {
      return;
    }

    renderedPreview.textContent = 'Rendering sample output...';
    await renderTransformedOutput(xslText, readFormState());
  });
});

metadataSelectAllButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.closest('.metadata-group');

    if (!group) {
      return;
    }

    group.querySelectorAll('input[name="metadataOptions"]').forEach((input) => {
      input.checked = true;
    });

    showToast(`${button.dataset.metadataGroup || 'Metadata'} metadata selected`);
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
