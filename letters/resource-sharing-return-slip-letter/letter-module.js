(function registerResourceSharingReturnSlipLetter() {
  const letterId = 'resource-sharing-return-slip-letter';

  const metadataOptions = [
    {
      option: 'title',
      label: 'Title',
      test: "notification_data/request/display/title !=''",
      value: 'notification_data/request/display/title'
    },
    {
      option: 'author',
      label: 'Author',
      test: "notification_data/request/display/author !=''",
      value: 'notification_data/request/display/author'
    },
    {
      option: 'isbn',
      label: 'ISBN',
      test: "notification_data/request/display/isbn !=''",
      value: 'notification_data/request/display/isbn'
    },
    {
      option: 'oclc-number',
      label: 'OCLC Number',
      test: "notification_data/request/display/oclc_number !=''",
      value: 'notification_data/request/display/oclc_number'
    },
    {
      option: 'place-of-publication',
      label: 'Place of Publication',
      test: "notification_data/request/display/place_of_publication !=''",
      value: 'notification_data/request/display/place_of_publication'
    },
    {
      option: 'publication-date',
      label: 'Publication Date',
      test: "notification_data/request/display/publication_date !=''",
      value: 'notification_data/request/display/publication_date'
    },
    {
      option: 'publisher',
      label: 'Publisher',
      test: "notification_data/request/display/publisher !=''",
      value: 'notification_data/request/display/publisher'
    },
    {
      option: 'volume',
      label: 'Volume',
      test: "notification_data/request/display/volume !=''",
      value: 'notification_data/request/display/volume'
    },
    {
      option: 'issue',
      label: 'Issue',
      test: "notification_data/request/display/issue !=''",
      value: 'notification_data/request/display/issue'
    },
    {
      option: 'note-to-partner',
      label: 'Note to Partner',
      test: "notification_data/note_to_partner !=''",
      value: 'notification_data/note_to_partner'
    }
  ];

  function buildLogoBlock(state, helpers) {
    if (state.includeLogo === 'alma-logo') {
      return [
        '							<tr>',
        '								<td style="padding:12px 0;">',
        '									<div style="width:350px; max-width:350px; text-align:center;">',
        '										<img src="cid:logo.jpg" alt="logo"/>',
        '									</div>',
        '								</td>',
        '							</tr>'
      ].join('\n');
    }

    if (state.includeLogo === 'yes' && state.logoUrl) {
      return [
        '							<tr>',
        '								<td style="padding:12px 0;">',
        '									<div style="width:350px; max-width:350px; text-align:center;">',
        `										<img src="${helpers.escapeHtml(state.logoUrl)}" alt="Library Logo" style="display:block; margin:0 auto; max-height:100px; max-width:350px;" />`,
        '									</div>',
        '								</td>',
        '							</tr>'
      ].join('\n');
    }

    return '';
  }

  function applyLogoChoice(templateText, state, helpers) {
    const logoBlock = buildLogoBlock(state, helpers);

    return templateText.replace(
      '							<!-- RETURN SLIP LOGO INSERTION POINT -->',
      logoBlock
    );
  }

  function buildMetadataBlock(state) {
    const selectedMetadata = new Set(state.metadataOptions || []);
    const selectedOptions = metadataOptions.filter(({ option }) => selectedMetadata.has(option));

    if (!selectedOptions.length) {
      return '';
    }

    const combinedTest = selectedOptions.map(({ test }) => test).join(' or ');
    const rows = selectedOptions.flatMap(({ label, test, value }) => [
      `											<xsl:if test="${test}">`,
      '												<tr>',
      '													<td style="padding:2px 4px;">',
      `														<strong> ${label}: </strong>`,
      `														<xsl:value-of select="${value}"/>`,
      '													</td>',
      '												</tr>',
      '											</xsl:if>'
    ]);

    return [
      '							<!-- BEGIN OPTIONAL BOOK INFORMATION -->',
      `							<xsl:if test="${combinedTest}">`,
      '								<tr>',
      '									<td>',
      '										<br/>',
      '										<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:350px; max-width:350px; border:2px solid #000; border-collapse:collapse; font-size:13px; line-height:1.15;">',
      ...rows,
      '										</table>',
      '									</td>',
      '								</tr>',
      '							</xsl:if>',
      '							<!-- END OPTIONAL BOOK INFORMATION -->'
    ].join('\n');
  }

  function applyMetadataSelection(templateText, state) {
    return templateText.replace(
      /[ \t]*<!-- BEGIN OPTIONAL BOOK INFORMATION -->[\s\S]*?<!-- END OPTIONAL BOOK INFORMATION -->[^\S\r\n]*/g,
      `${buildMetadataBlock(state)}\n`
    );
  }

  function buildShippingLabelBlock(state) {
    const isFullPage = state.returnSlipPrintMethod === 'full-page-multiple';
    const includeReferenceBlock = !state.omitReferenceBlock;
    const alignsWithBookMetadata = state.alignWithBookMetadata;
    const isCompactBookInfoLabel = state.compactForBookInformation;
    const tableStyle = isFullPage
      ? 'width:6.4in; max-width:6.4in; height:8.8in; table-layout:fixed; border-collapse:collapse; margin:0 auto; page-break-after:always; border:2px solid #000;'
      : `width:350px; max-width:350px; table-layout:fixed; border-collapse:collapse;${alignsWithBookMetadata ? ' margin-left:20px;' : ''} border:2px solid #000;`;
    const referenceBlockStyle = isFullPage
      ? 'width:6.4in; max-width:6.4in; margin:0 auto 0.12in auto; font-size:22px; line-height:1.1;'
      : 'width:350px; max-width:350px; margin:0 0 6px 0; font-size:10px; line-height:1.15;';
    const returnCellStyle = isFullPage
      ? 'font-size:24px;width:6.4in; height:2.2in; padding:0.28in; line-height:1.12; border-bottom:2px solid #000; text-align:left;'
      : `font-size:10px;width:350px; padding:${isCompactBookInfoLabel ? '7px 14px' : '12px 16px'}; line-height:1.15; border-bottom:2px solid #000; text-align:left;`;
    const shipCellStyle = isFullPage
      ? 'font-size:42px;width:6.4in; height:5.8in; padding:0.28in; line-height:1.05; text-align:center;'
      : `font-size:${isCompactBookInfoLabel ? '22px' : '24px'};width:350px; height:${isCompactBookInfoLabel ? '170px' : '210px'}; padding:10px 18px; line-height:1.05; text-align:center;`;
    const sectionLabelStyle = isFullPage
      ? 'font-size:20px; font-weight:bold; text-transform:uppercase;'
      : 'font-size:9px; font-weight:bold; text-transform:uppercase;';

    return [
      ...(includeReferenceBlock ? [
        `						<div style="${referenceBlockStyle}">`,
        '							<b>Title: </b><xsl:value-of select="notification_data/request/display/title"/>',
        '							<br/>',
        '							<b>External Identifier: </b><xsl:value-of select="notification_data/request/external_request_id"/>',
        '						</div>'
      ] : []),
      `						<table class="shippingLabel" cellspacing="0" cellpadding="0" border="0" style="${tableStyle}">`,
      '							<tr>',
      `								<td style="${returnCellStyle}">`,
      `									<div style="${sectionLabelStyle}">Return To</div>`,
      '									<br/>',
      '									<div><b><xsl:value-of select="notification_data/library/name"/></b></div>',
      '									<xsl:if test="notification_data/library/address/line1 !=\'\'"><div><xsl:value-of select="notification_data/library/address/line1"/></div></xsl:if>',
      '									<xsl:if test="notification_data/library/address/line2 !=\'\'"><div><xsl:value-of select="notification_data/library/address/line2"/></div></xsl:if>',
      '									<xsl:if test="notification_data/library/address/line3 !=\'\'"><div><xsl:value-of select="notification_data/library/address/line3"/></div></xsl:if>',
      '									<xsl:if test="notification_data/library/address/line4 !=\'\'"><div><xsl:value-of select="notification_data/library/address/line4"/></div></xsl:if>',
      '									<xsl:if test="notification_data/library/address/line5 !=\'\'"><div><xsl:value-of select="notification_data/library/address/line5"/></div></xsl:if>',
      '									<xsl:if test="notification_data/library/address/city !=\'\'"><div><xsl:value-of select="notification_data/library/address/city"/></div></xsl:if>',
      '									<xsl:if test="notification_data/library/address/country !=\'\'"><div><xsl:value-of select="notification_data/library/address/country"/></div></xsl:if>',
      '								</td>',
      '							</tr>',
      '							<tr>',
      `								<td style="${shipCellStyle}">`,
      `									<div style="${sectionLabelStyle}">Ship To</div>`,
      '									<br/>',
      '									<div><b><xsl:value-of select="notification_data/partner_name"/></b></div>',
      '									<xsl:if test="notification_data/partner_address/line1 !=\'\'"><div><b><xsl:value-of select="notification_data/partner_address/line1"/></b></div></xsl:if>',
      '									<xsl:if test="notification_data/partner_address/line2 !=\'\'"><div><b><xsl:value-of select="notification_data/partner_address/line2"/></b></div></xsl:if>',
      '									<xsl:if test="notification_data/partner_address/line3 !=\'\'"><div><b><xsl:value-of select="notification_data/partner_address/line3"/></b></div></xsl:if>',
      '									<xsl:if test="notification_data/partner_address/line4 !=\'\'"><div><b><xsl:value-of select="notification_data/partner_address/line4"/></b></div></xsl:if>',
      '									<xsl:if test="notification_data/partner_address/line5 !=\'\'"><div><b><xsl:value-of select="notification_data/partner_address/line5"/></b></div></xsl:if>',
      '									<xsl:if test="notification_data/partner_address/city !=\'\'"><div><b><xsl:value-of select="notification_data/partner_address/city"/></b></div></xsl:if>',
      '									<xsl:if test="notification_data/partner_address/country !=\'\'"><div><b><xsl:value-of select="notification_data/partner_address/country"/></b></div></xsl:if>',
      '								</td>',
      '							</tr>',
      '						</table>'
    ].join('\n');
  }

  function applyContentChoice(templateText, state) {
    if (state.returnSlipContentMode === 'shipping-label-only') {
      return templateText.replace(
        /[ \t]*<!-- BEGIN RETURN SLIP CONTENT -->[\s\S]*?<!-- END RETURN SLIP CONTENT -->[^\S\r\n]*/g,
        `\n${buildShippingLabelBlock(state)}\n`
      );
    }

    if (state.returnSlipContentMode === 'include-book-information') {
      const defaultLabelState = {
        ...state,
        returnSlipPrintMethod: 'default-size',
        omitReferenceBlock: true,
        alignWithBookMetadata: true,
        compactForBookInformation: true
      };

      return templateText.replace(
        '<!-- END RETURN SLIP CONTENT -->',
        `<br/>\n${buildShippingLabelBlock(defaultLabelState)}\n						<!-- END RETURN SLIP CONTENT -->`
      );
    }

    return templateText;
  }

  window.letterModules = window.letterModules || {};
  window.letterModules[letterId] = {
    metadataOptions,
    applyTemplateReplacements(templateText, state, helpers) {
      let output = applyLogoChoice(templateText, state, helpers);
      output = applyMetadataSelection(output, state);
      output = applyContentChoice(output, state);
      return output;
    }
  };
}());
