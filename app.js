const form = document.querySelector('#builder-form');
const preview = document.querySelector('#xsl-preview');
const renderedPreview = document.querySelector('#rendered-preview');
const resetButton = document.querySelector('#reset-button');
const copyXslButton = document.querySelector('#copy-xsl-button');
const downloadXslButton = document.querySelector('#download-xsl-button');
const generateAccessibilityStatementButton = document.querySelector('#generate-accessibility-statement-button');
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
const DEFAULT_ACCESSIBILITY_STATEMENT = `<<Library>> is committed to accessibility. If you have any problems accessing this material, please contact the <<Accessibility Contact>> at <<Contact Phone>> or <<Contact Email>>.`;
const DEFAULT_COPYRIGHT_STATEMENT = `The copyright law of the United States (Title 17, United States Code), governs the making of photocopies or other reproductions of copyrighted material.
Under certain conditions specified in the law, libraries and archives are authorized to furnish a photocopy or other reproduction.
One of these specified conditions is that the photocopy or reproduction is not to be "used for any purpose other than private study, scholarship, or research."
If a user makes a request for, or later uses, a photocopy or reproduction for purposes in excess of "fair use," that user may be liable for copyright infringement.
This institution reserves the right to refuse to accept a copying order, if, in its judgment, fulfillment of the order would involve violation of copyright law.`;
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

const DEFAULT_PICK_FROM_SHELF_HOLD_SHELF_HTML = `
	<html>
			<xsl:if test="notification_data/languages/string">
				<xsl:attribute name="lang">
					<xsl:value-of select="notification_data/languages/string"/>
				</xsl:attribute>
			</xsl:if>

		<head>
				<title>
					<xsl:value-of select="notification_data/general_data/subject"/>
				</title>

		<xsl:call-template name="generalStyle" />
		</head>

			<body>
			<h1>
				<strong>@@requested_for@@ :
							<xsl:value-of select="notification_data/user_for_printing/name"/>
				</strong>
			</h1>


				<xsl:call-template name="head" /> <!-- header.xsl -->



			<div class="messageArea">
				<div class="messageBody">
					 <table role='presentation'  cellspacing="0" cellpadding="5" border="0">
						<xsl:if  test="notification_data/request/selected_inventory_type='ITEM'" >
						<tr>
							<td><strong>@@note_item_specified_request@@.</strong></td>
						</tr>
						</xsl:if>
						<xsl:if  test="notification_data/request/manual_description != ''" >
						<tr>
							<td><strong>@@please_note@@: </strong>@@manual_description_note@@ - <xsl:value-of select="notification_data/request/manual_description"/></td>
						</tr>
						</xsl:if>
						<tr>
							<td><strong>@@request_id@@: </strong><img src="cid:request_id_barcode.png" alt="Request Barcode"/></td>
						</tr>
						<xsl:if  test="notification_data/phys_item_display/barcode != ''">
						<tr>
							<td><strong>@@item_barcode@@: </strong><img src="cid:item_id_barcode.png" alt="Item Barcode"/></td>
						</tr>
						</xsl:if>
						<xsl:if  test="notification_data/external_id != ''" >
							<tr>
								<td><strong>@@external_id@@: </strong><xsl:value-of select="notification_data/external_id"/></td>
							</tr>
						</xsl:if>

						<xsl:if test="notification_data/user_for_printing/name">

						<tr>
							<td>
						<strong>@@requested_for@@: </strong>
							<xsl:value-of select="notification_data/user_for_printing/name"/></td>
						</tr>

						</xsl:if>
						
						<xsl:if test="notification_data/proxy_requester/name">
							<tr>
								<td><strong>@@proxy_requester@@: </strong><xsl:value-of select="notification_data/proxy_requester/name"/></td>
							</tr>
						</xsl:if>

						<tr>
							<td><xsl:call-template name="recordTitle" />
							</td>
						</tr>

							<xsl:if test="notification_data/phys_item_display/isbn != ''">
								<tr>
								<td>@@isbn@@: <xsl:value-of select="notification_data/phys_item_display/isbn"/></td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/phys_item_display/issn != ''">
								<tr>
								<td>@@issn@@: <xsl:value-of select="notification_data/phys_item_display/issn"/></td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/phys_item_display/edition != ''">
								<tr>
								<td>@@edition@@: <xsl:value-of select="notification_data/phys_item_display/edition"/></td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/phys_item_display/imprint != ''">
								<tr>
								<td>@@imprint@@: <xsl:value-of select="notification_data/phys_item_display/imprint"/></td>
								</tr>
							</xsl:if>

						<strong></strong>
						<tr>
							<td><h2><strong>@@location@@: </strong><xsl:value-of select="notification_data/phys_item_display/location_name"/></h2></td>
							<xsl:if test="notification_data/phys_item_display/call_number != ''">
								<td><h2><strong>@@call_number@@: </strong><xsl:value-of select="notification_data/phys_item_display/call_number"/></h2></td>
							</xsl:if>
							<xsl:if test="notification_data/phys_item_display/accession_number != ''">
								<td><h2><strong>@@accession_number@@: </strong><xsl:value-of select="notification_data/phys_item_display/accession_number"/></h2></td>
							</xsl:if>
						</tr>
						<xsl:if  test="notification_data/phys_item_display/shelving_location/string" >
							<xsl:if  test="notification_data/request/selected_inventory_type='ITEM'" >
							<tr>
								<td><strong>@@shelving_location_for_item@@: </strong>
								 <xsl:for-each select="notification_data/phys_item_display/shelving_location/string">
									<xsl:value-of select="."/>
								 &#160;
								 </xsl:for-each>
								</td>
							</tr>
							</xsl:if>
							<xsl:if  test="notification_data/request/selected_inventory_type='HOLDING'" >
							<tr>
								<td><strong>@@shelving_locations_for_holding@@: </strong>
								<xsl:for-each select="notification_data/phys_item_display/shelving_location/string">
									<xsl:value-of select="."/>
								&#160;
								 </xsl:for-each>
								</td>
							</tr>
							</xsl:if>
							<xsl:if  test="notification_data/request/selected_inventory_type='VIRTUAL_HOLDING'" >
							<tr>
								<td><strong>@@shelving_locations_for_holding@@: </strong>
								<xsl:for-each select="notification_data/phys_item_display/shelving_location/string">
									<xsl:value-of select="."/>
								&#160;
								 </xsl:for-each>
								</td>
							</tr>
							</xsl:if>
						</xsl:if>
						<xsl:if  test="notification_data/phys_item_display/display_alt_call_numbers/string" >
							<xsl:if  test="notification_data/request/selected_inventory_type='ITEM'" >
							<tr>
								<td><strong>@@alt_call_number@@: </strong>
								 <xsl:for-each select="notification_data/phys_item_display/display_alt_call_numbers/string">
									<xsl:value-of select="."/>
								 &#160;
								 </xsl:for-each>
								</td>
							</tr>
							</xsl:if>
							<xsl:if  test="notification_data/request/selected_inventory_type='HOLDING'" >
							<tr>
								<td><strong>@@alt_call_number@@: </strong>
								<xsl:for-each select="notification_data/phys_item_display/display_alt_call_numbers/string">
									<xsl:value-of select="."/>
								&#160;
								 </xsl:for-each>
								</td>
							</tr>
							</xsl:if>
							<xsl:if  test="notification_data/request/selected_inventory_type='VIRTUAL_HOLDING'" >
							<tr>
								<td><strong>@@alt_call_number@@: </strong>
								<xsl:for-each select="notification_data/phys_item_display/display_alt_call_numbers/string">
									<xsl:value-of select="."/>
								&#160;
								 </xsl:for-each>
								</td>
							</tr>
							</xsl:if>
						</xsl:if>

						<strong></strong>

						<tr>
							<td><strong>@@move_to_library@@: </strong><xsl:value-of select="notification_data/destination"/></td>
						</tr>
						<tr>
							<td><strong>@@request_type@@: </strong><xsl:value-of select="notification_data/request_type"/></td>
						</tr>

						<xsl:if test="notification_data/request/system_notes != ''">
							<tr>
							<td><strong>@@system_notes@@:</strong><xsl:value-of select="notification_data/request/system_notes"/></td>
						</tr>
						</xsl:if>

						<xsl:if test="notification_data/request/note != ''">
							<tr>
							<td><strong>@@request_note@@:</strong> <xsl:value-of select="notification_data/request/note"/></td>
						</tr>
						</xsl:if>


					</table>
				</div>
			</div>




	<xsl:call-template name="lastFooter" /> <!-- footer.xsl -->





</body>
</html>`;

const PREVIEW_PICK_FROM_SHELF_INCLUDE_TEMPLATES = `
<xsl:template name="generalStyle">
 <style>
 body {@@language_related_body_css@@ background-color:#fff}
 .listing td {border-bottom: 1px solid #eee}
 .listing tr:hover td {background-color:#eee}
 .listing th {background-color:#f5f5f5 }
 h4{line-height: 0.2em}
 </style>
</xsl:template>

<xsl:template name="bodyStyleCss">
font-family: arial; color:#333; margin:0; padding:0em; font-size:80% 
</xsl:template>

<xsl:template name="listStyleCss">
list-style: none; margin:0 0 0 1em; padding:0
</xsl:template>

<xsl:template name="mainTableStyleCss">
width:100%; text-align:left
</xsl:template>

<xsl:template name="headerLogoStyleCss">
background-color:#ffffff;  width:100%;
</xsl:template>

<xsl:template name="headerTableStyleCss">
background-color:#e9e9e9;  width:100%; height:30px; text-shadow:1px 1px 1px #fff;
</xsl:template>

<xsl:template name="footerTableStyleCss">
width:100%; text-shadow:1px 1px 1px #333; color:#fff; margin-top:1em;  font-weight:700; line-height:2em; font-size:150%;
</xsl:template>

<xsl:template name="head">
<table cellspacing="0" cellpadding="5" border="0">
	<xsl:attribute name="style">
		<xsl:call-template name="headerTableStyleCss" />
	</xsl:attribute>
	<tr>
  <xsl:for-each select="notification_data/general_data">
	 <td>
		<h1><xsl:value-of select="letter_name"/></h1>
	</td>
	<td align="right">
		<xsl:value-of select="current_date"/>
	</td>
  </xsl:for-each>
</tr>
</table>
</xsl:template>

<xsl:template name="lastFooter">
	<table>
	<xsl:attribute name="style">
		<xsl:call-template name="footerTableStyleCss" />
	</xsl:attribute>
	<tr>
	<xsl:for-each select="notification_data/organization_unit">
		<xsl:attribute name="style">
			<xsl:call-template name="listStyleCss" />
		</xsl:attribute>
			<td align="center"><xsl:value-of select="name"/>&#160;<xsl:value-of select="line1"/>&#160;<xsl:value-of select="line2"/>&#160;<xsl:value-of select="city"/>&#160;<xsl:value-of select="postal_code"/>&#160;<xsl:value-of select="country"/></td>
	</xsl:for-each>
	</tr>
	</table>
</xsl:template>

<xsl:template name="recordTitle">
			<div class="recordTitle">
				<span class="spacer_after_1em"><xsl:value-of select="notification_data/phys_item_display/title"/></span>
			</div>
			<xsl:if test="notification_data/phys_item_display/author !=''">
				<div class="">
					<span class="spacer_after_1em">
						<span class="recordAuthor">@@by@@ <xsl:value-of select="notification_data/phys_item_display/author"/></span>
					</span>
				</div>
			</xsl:if>
			<xsl:if test="notification_data/phys_item_display/issue_level_description !=''">
				<div class="">
					<span class="spacer_after_1em">
						<span class="volumeIssue">@@description@@ <xsl:value-of select="notification_data/phys_item_display/issue_level_description"/></span>
					</span>
				</div>
			</xsl:if>
</xsl:template>

<xsl:template name="senderReceiver">
<table cellspacing="0" cellpadding="5" border="0" width="100%">
	<tr>
		<td width="50%">
	<xsl:choose>
		<xsl:when test="notification_data/user_for_printing">
			<table cellspacing="0" cellpadding="5" border="0">
		<xsl:attribute name="style">
			<xsl:call-template name="listStyleCss" />
		</xsl:attribute>
			<tr><td><b><xsl:value-of select="notification_data/user_for_printing/name"/></b></td></tr>
			<xsl:variable name="address1" select="notification_data/user_for_printing/address1"></xsl:variable>
			<xsl:if test="$address1 != ''"><tr><td><xsl:value-of select="$address1"/></td></tr></xsl:if>
			<xsl:variable name="address2" select="notification_data/user_for_printing/address2"></xsl:variable>
			<xsl:if test="$address2 != ''"><tr><td><xsl:value-of select="$address2"/></td></tr></xsl:if>
			<xsl:variable name="address3" select="notification_data/user_for_printing/address3"></xsl:variable>
			<xsl:if test="$address3 != ''"><tr><td><xsl:value-of select="$address3"/></td></tr></xsl:if>
			<xsl:variable name="address4" select="notification_data/user_for_printing/address4"></xsl:variable>
			<xsl:if test="$address4 != ''"><tr><td><xsl:value-of select="$address4"/></td></tr></xsl:if>
			<xsl:variable name="address5" select="notification_data/user_for_printing/address5"></xsl:variable>
			<xsl:if test="$address5 != ''"><tr><td><xsl:value-of select="$address5"/></td></tr></xsl:if>
			<tr><td><xsl:value-of select="notification_data/user_for_printing/city"/>&#160;<xsl:value-of select="notification_data/user_for_printing/postal_code"/></td></tr>
			<tr><td><xsl:value-of select="notification_data/user_for_printing/state"/>&#160;<xsl:value-of select="notification_data/user_for_printing/country"/></td></tr>
		</table>
		</xsl:when>
		<xsl:when test="notification_data/receivers/receiver/user">
			<xsl:for-each select="notification_data/receivers/receiver/user">
		<table>
		<xsl:attribute name="style">
			<xsl:call-template name="listStyleCss" />
		</xsl:attribute>
			<tr><td><b><xsl:value-of select="last_name"/>&#160;<xsl:value-of select="first_name"/></b></td></tr>
			<tr><td><xsl:value-of select="user_address_list/user_address/line1"/></td></tr>
			<tr><td><xsl:value-of select="user_address_list/user_address/line2"/></td></tr>
			<tr><td><xsl:value-of select="user_address_list/user_address/city"/>&#160;<xsl:value-of select="user_address_list/user_address/postal_code"/></td></tr>
			<tr><td><xsl:value-of select="user_address_list/user_address/state_province"/>&#160;<xsl:value-of select="user_address_list/user_address/country"/></td></tr>
		</table>
	</xsl:for-each>
		</xsl:when>
		<xsl:otherwise>
		</xsl:otherwise>
	</xsl:choose>
		</td>
		<td width="50%" align="right">
			<xsl:for-each select="notification_data/organization_unit">
		<table>
		<xsl:attribute name="style">
			<xsl:call-template name="listStyleCss" />
		</xsl:attribute>
			<tr><td><xsl:value-of select="name"/></td></tr>
			<tr><td><xsl:value-of select="address/line1"/></td></tr>
			<tr><td><xsl:value-of select="address/line2"/></td></tr>
			<tr><td><xsl:value-of select="address/city"/></td></tr>
			<tr><td><xsl:value-of select="address/postal_code"/></td></tr>
			<tr><td><xsl:value-of select="address/country"/></td></tr>
		</table>
	</xsl:for-each>
		</td>
	</tr>
</table>
</xsl:template>

<xsl:template name="toWhomIsConcerned">
<table cellspacing="0" cellpadding="5" border="0">
	<tr>
		<td>
			<xsl:for-each select="notification_data">
				<h3>@@dear@@ &#160;<xsl:value-of select="receivers/receiver/user/first_name"/>&#160;<xsl:value-of select="receivers/receiver/user/last_name"/>,</h3>
			</xsl:for-each>
		</td>
	</tr>
</table>
</xsl:template>
`;

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
  },
  'hold-shelf': {
    label: 'Hold Shelf',
    file: './sample-hold-shelf.xml'
  },
  'resource-sharing': {
    label: 'Resource Sharing',
    file: './sample-resource-sharing.xml'
  }
};

const previewSamplesByLetter = {
  'pull-slip-letter': ['book', 'book-chapter', 'article'],
  'pick-from-shelf': ['resource-sharing', 'hold-shelf']
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
    shortName: 'Pick from shelf (Alma P2P Pull Slip)',
    almaLetter: 'Ful Resource Request Letter',
    chunks: ['shell', 'real-template-file'],
    templateFile: './pull-slip-request-letter.xsl'
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

function getActiveFieldValue(fieldName, selectedLetter) {
  const candidates = Array.from(form.querySelectorAll(`[name="${fieldName}"]`));

  if (!candidates.length) {
    return '';
  }

  const matchingCandidate = candidates.find((field) => {
    const questionGroup = field.closest('[data-letter-question]');

    if (!questionGroup) {
      return true;
    }

    return questionAppliesToLetter(questionGroup, selectedLetter) && !questionGroup.hidden;
  });

  return (matchingCandidate || candidates[0]).value || '';
}

function readFormState() {
  const selectedLetter = form.elements.letterType.value;

  return {
    libraryName: form.elements.libraryName.value.trim(),
    letterType: selectedLetter,
    hasCustomHoldShelfLetter: form.elements.hasCustomHoldShelfLetter?.value || '',
    customHoldShelfLetterXsl: form.elements.customHoldShelfLetterXsl?.value || '',
    includeLogo: form.elements.includeLogo.value,
    logoUrl: form.elements.logoUrl.value.trim(),
    labelChoice: getActiveFieldValue('labelChoice', selectedLetter),
    includeCreateDate: form.elements.includeCreateDate.value,
    createDateFormat: form.elements.createDateFormat.value,
    noteAreaType: form.elements.noteAreaType.value,
    includeCustomMessage: getActiveFieldValue('includeCustomMessage', selectedLetter),
    customMessageText: form.elements.customMessageText?.value || '',
    includeAccessibilityStatement: getActiveFieldValue('includeAccessibilityStatement', selectedLetter),
    accessibilityStatementMode: getActiveFieldValue('accessibilityStatementMode', selectedLetter),
    accessibilityContact: form.elements.accessibilityContact?.value || '',
    accessibilityPhone: form.elements.accessibilityPhone?.value || '',
    accessibilityEmail: form.elements.accessibilityEmail?.value || '',
    accessibilityCustomStatementText: form.elements.accessibilityCustomStatementText?.value || '',
    includeCopyrightStatement: getActiveFieldValue('includeCopyrightStatement', selectedLetter),
    copyrightStatementText: form.elements.copyrightStatementText?.value || DEFAULT_COPYRIGHT_STATEMENT,
    metadataOptions: Array.from(form.querySelectorAll('input[name="metadataOptions"]:checked')).map((input) => input.value)
  };
}

function resetFormForLetterChange(nextLetterType = '') {
  const preservedLibraryName = form.elements.libraryName.value;

  Object.entries(defaultState).forEach(([key, value]) => {
    if (key === 'libraryName' || key === 'letterType' || key === 'metadataOptions') {
      return;
    }

    const field = form.elements[key];

    if (!field) {
      return;
    }

    field.value = value;
  });

  form.querySelectorAll('input[name="metadataOptions"]').forEach((input) => {
    input.checked = false;
  });

  form.elements.libraryName.value = preservedLibraryName;
  form.elements.letterType.value = nextLetterType;
  syncLetterSpecificQuestions();
  syncSelectedPreviewSample();
  syncPreviewSampleButtons();
  preview.textContent = '';
  renderedPreview.innerHTML = '';
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

function extractFirstHtmlFragment(xslText) {
  if (!xslText) {
    return '';
  }

  const match = xslText.match(/<html\b[\s\S]*?<\/html>/i);
  return match ? match[0].trim() : '';
}

function hasValidCustomHoldShelfXsl(state) {
  if (state.letterType !== 'pick-from-shelf' || state.hasCustomHoldShelfLetter !== 'yes') {
    return true;
  }

  return Boolean(extractFirstHtmlFragment(state.customHoldShelfLetterXsl));
}

function getLetterDefinition(letterType) {
  return letterDefinitions[letterType] || letterDefinitions['pull-slip-letter'];
}

function getAllowedPreviewSamples(letterType) {
  return previewSamplesByLetter[letterType] || ['book'];
}

function questionAppliesToLetter(element, selectedLetter) {
  const letters = (element.dataset.letterQuestion || '')
    .split(/\s+/)
    .filter(Boolean);

  return letters.includes(selectedLetter);
}

function syncLetterSpecificQuestions() {
  const selectedLetter = form.elements.letterType.value;
  const hasLetter = Boolean(selectedLetter);
  const logoUrlField = form.elements.logoUrl;
  const includeLogoField = form.elements.includeLogo;
  const customHoldShelfLetterField = form.elements.customHoldShelfLetterXsl;
  const hasCustomHoldShelfLetterField = form.elements.hasCustomHoldShelfLetter;

  letterSpecificQuestions.hidden = !hasLetter;
  letterSpecificQuestions.style.display = hasLetter ? '' : 'none';

  letterQuestionGroups.forEach((element) => {
    const isMatch = questionAppliesToLetter(element, selectedLetter);
    element.hidden = !isMatch;
    element.style.display = isMatch ? '' : 'none';
  });

  dependentQuestionGroups.forEach((element) => {
    const controllingField = form.elements[element.dataset.dependentQuestion];
    const expectedValue = element.dataset.dependentValue;
    const secondaryControllingField = element.dataset.dependentQuestionSecondary
      ? form.elements[element.dataset.dependentQuestionSecondary]
      : null;
    const secondaryExpectedValue = element.dataset.dependentValueSecondary;
    const shouldShow = hasLetter
      && questionAppliesToLetter(element, selectedLetter)
      && controllingField
      && controllingField.value === expectedValue;
    const shouldShowSecondary = !secondaryControllingField
      || secondaryControllingField.value === secondaryExpectedValue;

    element.hidden = !(shouldShow && shouldShowSecondary);
    element.style.display = shouldShow && shouldShowSecondary ? '' : 'none';
  });

  if (logoUrlField && includeLogoField) {
    const requiresLogoUrl = hasLetter
      && ['pull-slip-letter', 'pick-from-shelf'].includes(selectedLetter)
      && includeLogoField.value === 'yes';

    logoUrlField.required = requiresLogoUrl;

    if (!requiresLogoUrl) {
      logoUrlField.value = '';
    }
  }

  if (
    customHoldShelfLetterField
    && hasCustomHoldShelfLetterField
    && (
      !hasLetter
      || selectedLetter !== 'pick-from-shelf'
      || hasCustomHoldShelfLetterField.value !== 'yes'
    )
  ) {
    customHoldShelfLetterField.value = '';
  }

  if (
    form.elements.accessibilityStatementPreview
    && (
      !hasLetter
      || selectedLetter !== 'pull-slip-letter'
      || form.elements.includeAccessibilityStatement?.value !== 'yes'
      || form.elements.accessibilityStatementMode?.value !== 'default'
    )
  ) {
    form.elements.accessibilityStatementPreview.value = '';
  }

  if (form.elements.accessibilityContact) {
    const requiresAccessibilityContact = hasLetter
      && selectedLetter === 'pull-slip-letter'
      && form.elements.includeAccessibilityStatement?.value === 'yes'
      && form.elements.accessibilityStatementMode?.value === 'default';

    form.elements.accessibilityContact.required = requiresAccessibilityContact;
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

function formatAccessibilityPhoneNumber(phone) {
  const digits = (phone || '').replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return (phone || '').trim();
}

function resolveAccessibilityStatementTemplate(state) {
  if (state.accessibilityStatementMode === 'custom') {
    return state.accessibilityCustomStatementText || '';
  }

  const phone = formatAccessibilityPhoneNumber(state.accessibilityPhone);
  const email = (state.accessibilityEmail || '').trim();
  let statement = DEFAULT_ACCESSIBILITY_STATEMENT
    .replaceAll('<<Library>>', state.libraryName || 'Library Name')
    .replaceAll('<<Accessibility Contact>>', state.accessibilityContact || 'Accessibility Contact')
    .replaceAll('<<Contact Phone>>', phone)
    .replaceAll('<<Contact Email>>', email);

  if (!phone && email) {
    statement = statement.replace(/at\s+or\s+/g, 'at ');
  }

  if (phone && !email) {
    statement = statement.replace(/\s+or\s*\./g, '.');
  }

  if (!phone && !email) {
    statement = statement.replace(/\s+at\s*\.\s*$/g, '.');
  }

  return statement;
}

function hasValidAccessibilityContactInfo(state) {
  if (
    state.letterType !== 'pull-slip-letter'
    || state.includeAccessibilityStatement !== 'yes'
    || state.accessibilityStatementMode !== 'default'
  ) {
    return true;
  }

  return Boolean((state.accessibilityPhone || '').trim() || (state.accessibilityEmail || '').trim());
}

function hasValidAccessibilityContactName(state) {
  if (
    state.letterType !== 'pull-slip-letter'
    || state.includeAccessibilityStatement !== 'yes'
    || state.accessibilityStatementMode !== 'default'
  ) {
    return true;
  }

  return Boolean((state.accessibilityContact || '').trim());
}

function updateAccessibilityStatementPreview() {
  const previewField = form.elements.accessibilityStatementPreview;

  if (!previewField) {
    return;
  }

  previewField.value = resolveAccessibilityStatementTemplate(readFormState());
}

function buildAccessibilityStatementBlock(state) {
  const email = (state.accessibilityEmail || '').trim();
  let resolvedStatement = resolveAccessibilityStatementTemplate(state);
  let escapedStatement = escapeXml(resolvedStatement);

  if (email) {
    const escapedEmail = escapeXml(email);
    const mailtoLink = `<a href="mailto:${escapedEmail}">${escapedEmail}</a>`;
    escapedStatement = escapedStatement.replaceAll(escapedEmail, mailtoLink);
  }

  const lines = escapedStatement
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const content = lines
    .map((line, index) => `${index > 0 ? '                          <br />\n' : ''}                          ${line}`)
    .join('');

  return [
    '                    <!-- ========================================================',
    '                         SECTION 11C - ACCESSIBILITY NOTICE',
    '                         ======================================================== -->',
    '                    <xsl:call-template name="spacer" />',
    '                    <tr>',
    '                      <td>',
    '                        <font size="1">',
    content,
    '                        </font>',
    '                      </td>',
    '                    </tr>',
    '                    <!-- ===== END SECTION 11C - ACCESSIBILITY NOTICE ===== -->'
  ].join('\n');
}

function applyAccessibilityStatementChoice(templateText, state) {
  const accessibilityPattern = /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 11C - ACCESSIBILITY NOTICE\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 11C - ACCESSIBILITY NOTICE ===== -->[^\S\r\n]*/;
  const copyrightAnchor = '                    <!-- ========================================================\n                         SECTION 11D - COPYRIGHT NOTICE\n                         ======================================================== -->';

  if (state.letterType !== 'pull-slip-letter') {
    return templateText;
  }

  let output = removeSectionByPattern(templateText, accessibilityPattern);

  if (state.includeAccessibilityStatement !== 'yes') {
    return output;
  }

  return output.replace(copyrightAnchor, `${buildAccessibilityStatementBlock(state)}\n${copyrightAnchor}`);
}

function buildCopyrightStatementBlock(copyrightText) {
  const lines = (copyrightText || DEFAULT_COPYRIGHT_STATEMENT)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const content = lines
    .map((line, index) => `${index > 0 ? '                          <br />\n' : ''}                          ${escapeXml(line)}`)
    .join('');

  return [
    '                    <!-- ========================================================',
    '                         SECTION 11D - COPYRIGHT NOTICE',
    '                         ======================================================== -->',
    '                    <xsl:call-template name="spacer" />',
    '                    <tr>',
    '                      <td>',
    '                        <font size="1">',
    content,
    '                        </font>',
    '                      </td>',
    '                    </tr>',
    '                    <!-- ===== END SECTION 11D - COPYRIGHT NOTICE ===== -->'
  ].join('\n');
}

function applyCopyrightStatementChoice(templateText, state) {
  const copyrightPattern = /[ \t]*<!-- [=\s]*\r?\n[ \t]*SECTION 11D - COPYRIGHT NOTICE\r?\n[ \t]*[=\s]*-->[\s\S]*?<!-- ===== END SECTION 11D - COPYRIGHT NOTICE ===== -->[^\S\r\n]*/;

  if (state.letterType !== 'pull-slip-letter') {
    return templateText;
  }

  if (state.includeCopyrightStatement === 'no') {
    return removeSectionByPattern(templateText, copyrightPattern);
  }

  if (state.includeCopyrightStatement === 'yes') {
    return templateText.replace(copyrightPattern, `${buildCopyrightStatementBlock(state.copyrightStatementText)}\n`);
  }

  return templateText;
}

function buildCustomMessageBlock(state) {
  const lines = (state.customMessageText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const content = lines
    .map((line, index) => `${index > 0 ? '                        <br />\n' : ''}                        ${escapeXml(line)}`)
    .join('');

  return [
    '                    <!-- BEGIN OPTIONAL CUSTOM MESSAGE -->',
    '                    <tr>',
    '                      <td style="width:350px;">',
    content,
    '                      </td>',
    '                    </tr>',
    '                    <xsl:call-template name="spacer" />',
    '                    <!-- END OPTIONAL CUSTOM MESSAGE -->'
  ].join('\n');
}

function applyCustomMessageChoice(templateText, state) {
  const customMessagePattern = /[ \t]*<!-- BEGIN OPTIONAL CUSTOM MESSAGE -->[\s\S]*?<!-- END OPTIONAL CUSTOM MESSAGE -->[^\S\r\n]*/g;

  if (!['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)) {
    return templateText;
  }

  if (state.includeCustomMessage !== 'yes') {
    return removeSectionByPattern(templateText, customMessagePattern);
  }

  return templateText.replace(customMessagePattern, `${buildCustomMessageBlock(state)}\n`);
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

const PHYSICAL_SPLIT_ELIGIBLE_METADATA = new Set([
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

const DIGITAL_SPLIT_ELIGIBLE_METADATA = new Set([
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

function shouldUseSectionSplitLayout(state) {
  const metadataCount = (state.metadataOptions || []).filter((option) => PHYSICAL_SPLIT_ELIGIBLE_METADATA.has(option)).length;
  const hasCheckboxConditionReport = state.noteAreaType === 'checkboxes';
  return ['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)
    && ((state.labelChoice !== '' && state.labelChoice !== 'no-label') || state.includeCustomMessage === 'yes')
    && (state.labelChoice === 'both-labels' || metadataCount >= 8 || hasCheckboxConditionReport || state.includeCustomMessage === 'yes');
}

function shouldUseDigitalSectionSplitLayout(state) {
  const metadataCount = (state.metadataOptions || []).filter((option) => DIGITAL_SPLIT_ELIGIBLE_METADATA.has(option)).length;

  return state.letterType === 'pull-slip-letter' && (metadataCount > 5 || state.includeCustomMessage === 'yes');
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

function extractOptionalCustomMessageBlock(templateText) {
  const customMessagePattern = /[ \t]*<!-- BEGIN OPTIONAL CUSTOM MESSAGE -->[\s\S]*?<!-- END OPTIONAL CUSTOM MESSAGE -->[^\S\r\n]*/;
  const match = templateText.match(customMessagePattern);

  if (!match) {
    return {
      customMessageBlock: '',
      templateWithoutCustomMessage: templateText
    };
  }

  return {
    customMessageBlock: match[0],
    templateWithoutCustomMessage: templateText.replace(customMessagePattern, '')
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

  const blockStart = text.lastIndexOf('<!--', start);
  const actualStart = blockStart !== -1 ? blockStart : start;

  const end = text.indexOf(endMarker, start);

  if (end === -1) {
    return {
      block: '',
      textWithoutBlock: text
    };
  }

  const blockEnd = end + endMarker.length;

  return {
    block: text.slice(actualStart, blockEnd),
    textWithoutBlock: `${text.slice(0, actualStart)}${text.slice(blockEnd)}`
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
    .replace(/^\s*<!-- [=\s]*SECTION 11D - COPYRIGHT NOTICE[\s\S]*?-->\s*/, '')
    .replace(/\s*<!-- ===== END SECTION 11D - COPYRIGHT NOTICE ===== -->\s*$/, '');
}

function normalizeMovedCustomMessageBlock(customMessageBlock) {
  if (!customMessageBlock) {
    return '';
  }

  return customMessageBlock
    .replaceAll('width:350px;', 'width:336px; min-width:336px; max-width:336px;')
    .replaceAll('width:350px', 'width:336px')
    .concat('\n                          <div style="height:12px;"></div>');
}

function stripDigitalAccessibilityWrapper(accessibilityBlock) {
  return accessibilityBlock
    .replace(/^\s*<!-- [=\s]*SECTION 11C - ACCESSIBILITY NOTICE[\s\S]*?-->\s*/, '')
    .replace(/\s*<!-- ===== END SECTION 11C - ACCESSIBILITY NOTICE ===== -->\s*$/, '');
}

function stripDigitalCustomMessageWrapper(customMessageBlock) {
  return customMessageBlock
    .replace(/^\s*<!-- BEGIN OPTIONAL CUSTOM MESSAGE -->\s*/, '')
    .replace(/\s*<!-- END OPTIONAL CUSTOM MESSAGE -->\s*$/, '');
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

function normalizeDigitalBarcodeBlock(barcodeBlock, hasCustomMessage) {
  if (!barcodeBlock) {
    return '';
  }

  if (!hasCustomMessage) {
    return barcodeBlock;
  }

  return barcodeBlock.replace(/^(\s*<xsl:call-template name="spacer" \/>\s*)+/, '');
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
    'SECTION 11A - DIGITAL ARTICLE',
    '<!-- ===== END SECTION 11A - DIGITAL ARTICLE ===== -->'
  );

  if (!articleExtract.block) {
    return templateText;
  }

  const chapterExtract = extractMarkedBlock(
    articleExtract.textWithoutBlock,
    'SECTION 11B - DIGITAL BOOK/CHAPTER',
    '<!-- ===== END SECTION 11B - DIGITAL BOOK/CHAPTER ===== -->'
  );

  const articleCustomMessageExtract = extractMarkedBlock(
    stripDigitalArticleWrapper(articleExtract.block),
    'BEGIN OPTIONAL CUSTOM MESSAGE',
    '<!-- END OPTIONAL CUSTOM MESSAGE -->'
  );

  const chapterCustomMessageExtract = extractMarkedBlock(
    stripDigitalChapterWrapper(chapterExtract.block),
    'BEGIN OPTIONAL CUSTOM MESSAGE',
    '<!-- END OPTIONAL CUSTOM MESSAGE -->'
  );

  const accessibilityExtract = extractMarkedBlock(
    chapterExtract.textWithoutBlock,
    'SECTION 11C - ACCESSIBILITY NOTICE',
    '<!-- ===== END SECTION 11C - ACCESSIBILITY NOTICE ===== -->'
  );

  const copyrightExtract = extractMarkedBlock(
    accessibilityExtract.block ? accessibilityExtract.textWithoutBlock : chapterExtract.textWithoutBlock,
    'SECTION 11D - COPYRIGHT NOTICE',
    '<!-- ===== END SECTION 11D - COPYRIGHT NOTICE ===== -->'
  );

  if (!chapterExtract.block) {
    return templateText;
  }

  const articleInner = articleCustomMessageExtract.textWithoutBlock || stripDigitalArticleWrapper(articleExtract.block);
  const chapterInner = chapterCustomMessageExtract.textWithoutBlock || stripDigitalChapterWrapper(chapterExtract.block);
  const accessibilityInner = accessibilityExtract.block ? stripDigitalAccessibilityWrapper(accessibilityExtract.block).trim() : '';
  const copyrightInner = copyrightExtract.block ? stripDigitalCopyrightWrapper(copyrightExtract.block).trim() : '';
  const articleCustomMessageInner = articleCustomMessageExtract.block ? stripDigitalCustomMessageWrapper(articleCustomMessageExtract.block).trim() : '';
  const chapterCustomMessageInner = chapterCustomMessageExtract.block ? stripDigitalCustomMessageWrapper(chapterCustomMessageExtract.block).trim() : '';

  const articleSplit = splitDigitalInternalBarcode(articleInner);
  const chapterSplit = splitDigitalInternalBarcode(chapterInner);

  const buildDigitalRightBlock = (customMessageBlock, barcodeBlock) => [
    '                      <div style="position:absolute; top:0; left:366px; width:336px !important; min-width:336px; max-width:336px; vertical-align:top; text-align:left;">',
    '                        <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:336px; max-width:336px; table-layout:fixed;">',
    customMessageBlock || '',
    normalizeDigitalBarcodeBlock(barcodeBlock, Boolean(customMessageBlock)),
    accessibilityInner ? '                          <tr><td style="height:12px;"></td></tr>' : '',
    accessibilityInner,
    copyrightInner ? '                          <tr><td style="height:12px;"></td></tr>' : '',
    copyrightInner,
    '                        </table>',
    '                      </div>'
  ].filter(Boolean).join('\n');

  const buildDigitalSplitBlock = (testExpression, leftContent, customMessageBlock, barcodeBlock) => [
    `                    <xsl:if test="${testExpression}">`,
    '                      <div style="position:relative; width:702px !important; max-width:702px !important; margin:0;">',
    '                        <div style="width:336px !important; min-width:336px; max-width:336px; margin-right:366px; vertical-align:top; text-align:left;">',
    '                          <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:336px; max-width:336px; table-layout:fixed;">',
    leftContent,
    '                          </table>',
    '                        </div>',
    buildDigitalRightBlock(customMessageBlock, barcodeBlock),
    '                      </div>',
    '                    </xsl:if>'
  ].join('\n');

  const rebuiltDigitalBlock = [
    '                  <!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->',
    `                  <xsl:if test="notification_data/incoming_request/format = 'DIGITAL'">`,
    buildDigitalSplitBlock("notification_data/metadata/material_type = 'Article'", articleSplit.leftContent, articleCustomMessageInner, articleSplit.barcodeBlock),
    '',
    buildDigitalSplitBlock("notification_data/metadata/material_type = 'Book'", chapterSplit.leftContent, chapterCustomMessageInner, chapterSplit.barcodeBlock),
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

function stripOuterPhysicalTableForPickFromShelf(leftPhysicalContent, state) {
  if (state.letterType !== 'pick-from-shelf') {
    return leftPhysicalContent;
  }

  return leftPhysicalContent
    .replace(/^\s*<table\b[^>]*>\s*/i, '')
    .replace(/\s*<\/table>\s*$/i, '')
    .trim();
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
  const { customMessageBlock, templateWithoutCustomMessage } = extractOptionalCustomMessageBlock(templateWithoutLabel);
  const { templateWithoutNote } = extractOptionalNoteAreaBlock(templateWithoutCustomMessage);
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
  const movedCustomMessageBlock = normalizeMovedCustomMessageBlock(customMessageBlock);
  const movedLabelBlocks = buildMovedPhysicalLabelBlocks(state, labelBlocks);
  const sideParts = [movedCustomMessageBlock, sideNoteBlock, movedLabelBlocks].filter(Boolean).map((part) => part.trim()).join('\n');
  const sideColumnBlock = [
    '<div style="width:336px; min-width:336px; max-width:336px; margin:0; text-align:left;">',
    sideParts,
    '</div>'
  ].join('\n');

  if (!sideParts) {
    return output.replaceAll('@@HEADER_ADJACENT_LABEL_CELL@@', '');
  }

  const leftPhysicalContent = stripOuterPhysicalTableForPickFromShelf(
    trimPhysicalContentForLeftCell(stripPhysicalSectionWrapper(templateWithoutNote)),
    state
  );
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

  if (['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)) {
    output = applyCreateDateChoice(output, state);
    output = applyCreateDateFormat(output, state);
  }

  if (state.letterType === 'pick-from-shelf') {
    let localCircHtml = '';

    if (state.hasCustomHoldShelfLetter === 'no') {
      localCircHtml = DEFAULT_PICK_FROM_SHELF_HOLD_SHELF_HTML;
    } else if (state.hasCustomHoldShelfLetter === 'yes') {
      localCircHtml = extractFirstHtmlFragment(state.customHoldShelfLetterXsl);
    }

    output = output.replace(
      /<!-- Start Add Your Local Circ Customizations Here Starting with <html> -->[\s\S]*?<!-- End Local Circ Customizations ending with <\/html> -->/,
      `<!-- Start Add Your Local Circ Customizations Here Starting with <html> --> \n\n${localCircHtml}\n\n<!-- End Local Circ Customizations ending with </html> -->`
    );
  }

  if (['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)) {
    output = applyMetadataSelection(output, state);
  }

  if (['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)) {
    output = applyNoteAreaChoice(output, state);
  }

  if (['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)) {
    output = applyCustomMessageChoice(output, state);
  }

  if (state.letterType === 'pull-slip-letter') {
    output = applyAccessibilityStatementChoice(output, state);
    output = applyCopyrightStatementChoice(output, state);
  }

  if (['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)) {
    output = applySelectedLabelChoice(output, state);
  }

  if (['pull-slip-letter', 'pick-from-shelf'].includes(state.letterType)) {
    output = applySectionSplitLayout(output, state);
  }

  if (state.letterType === 'pull-slip-letter') {
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

function buildPreviewSafeXsl(xslText, state) {
  if (state.letterType !== 'pick-from-shelf') {
    return xslText;
  }

  let output = xslText.replace(/<xsl:include href="[^"]+"\s*\/>\s*/g, '');

  if (!output.includes('<xsl:template name="generalStyle">')) {
    output = output.replace('<xsl:template match="/">', `${PREVIEW_PICK_FROM_SHELF_INCLUDE_TEMPLATES}\n<xsl:template match="/">`);
  }

  return output;
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
  const allowedSamples = new Set(getAllowedPreviewSamples(form.elements.letterType.value));

  previewSampleButtons.forEach((button) => {
    const sampleType = button.dataset.previewSample || '';
    const isAllowed = allowedSamples.has(sampleType);

    button.hidden = !isAllowed;

    if (!isAllowed) {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
      return;
    }

    const isActive = button.dataset.previewSample === selectedPreviewSample;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function syncSelectedPreviewSample() {
  const allowedSamples = getAllowedPreviewSamples(form.elements.letterType.value);

  if (!allowedSamples.includes(selectedPreviewSample)) {
    selectedPreviewSample = allowedSamples[0] || 'book';
  }
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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getXmlValue(xmlDoc, selector) {
  return xmlDoc.querySelector(selector)?.textContent?.trim() || '';
}

function formatPreviewCreateDate(dateText, format) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateText || '');

  if (!match) {
    return dateText || '';
  }

  const [, month, day, year] = match;
  const monthIndex = Number(month) - 1;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[monthIndex] || month;

  if (format === 'numerical-europe') {
    return `${day}/${month}/${year}`;
  }

  if (format === 'readable') {
    return `${monthName} ${Number(day)}, ${year}`;
  }

  if (format === 'readable-europe') {
    return `${Number(day)} ${monthName} ${year}`;
  }

  return `${month}/${day}/${year}`;
}

function buildPickFromShelfFallbackPreview(xmlText, state) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(normalizeXmlForParsing(xmlText), 'application/xml');

  if (xmlDoc.querySelector('parsererror')) {
    return '';
  }

  const isHoldShelf = getXmlValue(xmlDoc, 'notification_data > group_qualifier') === '';
  const title = getXmlValue(xmlDoc, 'notification_data > phys_item_display > title')
    || getXmlValue(xmlDoc, 'notification_data > incoming_request > title');
  const author = getXmlValue(xmlDoc, 'notification_data > phys_item_display > author');
  const currentDate = getXmlValue(xmlDoc, 'notification_data > general_data > current_date');
  const letterName = getXmlValue(xmlDoc, 'notification_data > general_data > letter_name');
  const requesterName = getXmlValue(xmlDoc, 'notification_data > user_for_printing > name');
  const requesterId = getXmlValue(xmlDoc, 'notification_data > user_for_printing > identifiers > code_value > value');
  const additionalId = getXmlValue(xmlDoc, 'notification_data > additional_id');
  const partnerName = getXmlValue(xmlDoc, 'notification_data > partner_name');
  const podName = getXmlValue(xmlDoc, 'notification_data > pod_name');
  const requesterEmail = getXmlValue(xmlDoc, 'notification_data > incoming_request > requester_email');
  const groupQualifier = getXmlValue(xmlDoc, 'notification_data > group_qualifier');
  const incomingCreateDate = getXmlValue(xmlDoc, 'notification_data > incoming_request > create_date');
  const locationName = getXmlValue(xmlDoc, 'notification_data > phys_item_display > location_name');
  const callNumber = getXmlValue(xmlDoc, 'notification_data > phys_item_display > call_number');
  const barcode = getXmlValue(xmlDoc, 'notification_data > phys_item_display > barcode');
  const isbn = getXmlValue(xmlDoc, 'notification_data > phys_item_display > isbn');
  const edition = getXmlValue(xmlDoc, 'notification_data > phys_item_display > edition');
  const imprint = getXmlValue(xmlDoc, 'notification_data > phys_item_display > imprint');
  const requestType = getXmlValue(xmlDoc, 'notification_data > request_type')
    || getXmlValue(xmlDoc, 'notification_data > request > request_type_display')
    || getXmlValue(xmlDoc, 'notification_data > request > request_type');
  const note = getXmlValue(xmlDoc, 'notification_data > request > note');
  const systemNotes = getXmlValue(xmlDoc, 'notification_data > request > system_notes');
  const destination = getXmlValue(xmlDoc, 'notification_data > destination');
  const expirationDate = getXmlValue(xmlDoc, 'notification_data > request > work_flow_entity > expiration_date');
  const formattedCreateDate = formatPreviewCreateDate(incomingCreateDate, state.createDateFormat || 'numerical');
  const logoUrl = state.includeLogo === 'yes' ? state.logoUrl : '';

  if (isHoldShelf) {
    const safeRequesterName = requesterName || '(no patron name in sample)';

    return `
      <div class="messageArea">
        <h1><strong>Requested For: ${escapeHtml(safeRequesterName)}</strong></h1>
        <table cellspacing="0" cellpadding="5" border="0" style="background-color:#e9e9e9; width:100%; height:30px;">
          <tr>
            <td><h1>${escapeHtml(letterName)}</h1></td>
            <td align="right">${escapeHtml(currentDate)}</td>
          </tr>
        </table>
        <div class="messageBody">
          <table role="presentation" cellspacing="0" cellpadding="5" border="0">
            ${barcode ? `<tr><td><strong>Item Barcode: </strong><img src="cid:item_id_barcode.png" alt="Item Barcode" /></td></tr>` : ''}
            <tr><td><strong>Title: </strong>${escapeHtml(title)}</td></tr>
            ${author ? `<tr><td><strong>By: </strong>${escapeHtml(author)}</td></tr>` : ''}
            ${isbn ? `<tr><td><strong>ISBN: </strong>${escapeHtml(isbn)}</td></tr>` : ''}
            ${edition ? `<tr><td><strong>Edition: </strong>${escapeHtml(edition)}</td></tr>` : ''}
            ${imprint ? `<tr><td><strong>Imprint: </strong>${escapeHtml(imprint)}</td></tr>` : ''}
            <tr><td><h2><strong>Location: </strong>${escapeHtml(locationName)}</h2></td>${callNumber ? `<td><h2><strong>Call Number: </strong>${escapeHtml(callNumber)}</h2></td>` : ''}</tr>
            <tr><td><strong>Move To Library: </strong>${escapeHtml(destination)}</td></tr>
            <tr><td><strong>Request Type: </strong>${escapeHtml(requestType)}</td></tr>
            ${systemNotes ? `<tr><td><strong>System Notes:</strong> ${escapeHtml(systemNotes)}</td></tr>` : ''}
            ${note ? `<tr><td><strong>Request Note:</strong> ${escapeHtml(note)}</td></tr>` : ''}
          </table>
        </div>
      </div>
    `;
  }

  return `
    <div class="messageArea">
      <div class="messageBody">
        <table border="0" cellspacing="0" cellpadding="0" style="width:350px; max-width:350px; table-layout:fixed;">
          ${partnerName ? `<tr><td style="font-size:14pt; width:350px;"><strong>${escapeHtml(partnerName)}</strong></td></tr>` : ''}
          ${podName ? `<tr><td style="width:350px;"><b>Pod:&nbsp;</b>${escapeHtml(podName)}</td></tr>` : ''}
          ${requesterEmail ? `<tr><td style="width:350px;"><b>Requester Email:</b> ${escapeHtml(requesterEmail)}</td></tr>` : ''}
          ${state.includeCreateDate === 'no' || !formattedCreateDate ? '' : `<tr><td style="width:350px;"><b>Date:&nbsp;</b>${escapeHtml(formattedCreateDate)}</td></tr>`}
        </table>
        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="Library Logo" style="display:block; margin:12px auto; max-height:100px; max-width:350px;" />` : ''}
        <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:350px; max-width:350px; table-layout:fixed;">
          <tr>
            <td style="width:350px;">
              <div class="emphBox" style="border:2px solid #000; padding:6px;">
                <div><b>Location:&nbsp;</b><span class="locCallValue">${escapeHtml(locationName)}</span></div>
                <div><b>Call Number:&nbsp;</b><b class="locCallValue">${escapeHtml(callNumber)}</b></div>
              </div>
            </td>
          </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="5" border="0">
          ${groupQualifier ? `<tr><td><img src="cid:group_qualifier.png" alt="group_qualifier" /></td></tr>` : ''}
          <tr><td><div class="recordTitle"><span class="spacer_after_1em">${escapeHtml(title)}</span></div>${author ? `<div><span class="spacer_after_1em"><span class="recordAuthor">By ${escapeHtml(author)}</span></span></div>` : ''}</td></tr>
          <tr><td><b>Due Date:</b> ${escapeHtml(expirationDate)}</td></tr>
          ${systemNotes ? `<tr><td><strong>System Notes:</strong> ${escapeHtml(systemNotes)}</td></tr>` : ''}
          ${note ? `<tr><td><strong>Request Note:</strong> ${escapeHtml(note)}</td></tr>` : ''}
          ${barcode ? `<tr><td><img src="cid:item_id_barcode.png" alt="Item Barcode" /></td></tr>` : ''}
          <tr><td><font color="red">NO RENEWALS</font></td></tr>
          <tr><td><b>Item Condition Report</b></td></tr>
        </table>
        <table cellspacing="0" cellpadding="5" border="1">
          <tr><td><b>__Binding Issues</b></td><td><b>__Writing/Highlighting</b></td></tr>
          <tr><td><b>__Cover/Spine Issues</b></td><td><b>__Liquid Damage/Stained</b></td></tr>
          <tr><td><b>__Other (describe below)</b></td><td><b>__Missing CD/DVD</b></td></tr>
        </table>
        <h1><font color="red">Do Not Remove Strap</font></h1>
      </div>
    </div>
  `;
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
    const previewXslText = buildPreviewSafeXsl(xslText, state);
    const xslDoc = parser.parseFromString(normalizeXmlForParsing(previewXslText), 'application/xml');

    if (xmlDoc.querySelector('parsererror') || xslDoc.querySelector('parsererror')) {
      renderedPreview.textContent = 'The sample XML or generated XSL could not be parsed for preview.';
      return;
    }

    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDoc);
    const resultDocument = processor.transformToFragment(xmlDoc, document);

    renderedPreview.appendChild(resultDocument);

    if (state.letterType === 'pick-from-shelf' && !renderedPreview.textContent.trim() && !renderedPreview.querySelector('*')) {
      const fallbackMarkup = buildPickFromShelfFallbackPreview(xmlText, state);

      if (fallbackMarkup) {
        renderedPreview.innerHTML = fallbackMarkup;
      }
    }

    cleanPreviewPlaceholderLabels(renderedPreview);
    replacePreviewBarcodeImages(renderedPreview);
    buildPaginatedPreview(renderedPreview);
  } catch (error) {
    console.error(error);
    if (state.letterType === 'pick-from-shelf') {
      const xmlText = applyCurrentDateToPreviewXml(applyLibraryNameToPreviewXml(await getSampleXml(selectedPreviewSample), state));
      const fallbackMarkup = buildPickFromShelfFallbackPreview(xmlText, state);

      if (fallbackMarkup) {
        renderedPreview.innerHTML = fallbackMarkup;
        cleanPreviewPlaceholderLabels(renderedPreview);
        replacePreviewBarcodeImages(renderedPreview);
        buildPaginatedPreview(renderedPreview);
        return;
      }
    }

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

  if (!hasValidCustomHoldShelfXsl(state)) {
    showToast('Custom Hold Shelf XSL is Invalid', 'error');
    return;
  }

  if (!hasValidAccessibilityContactInfo(state)) {
    showToast('Phone or email is required', 'error');
    return;
  }

  if (!hasValidAccessibilityContactName(state)) {
    showToast('Accessibility Contact is required', 'error');
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
  resetFormForLetterChange(form.elements.letterType.value);
});

form.elements.includeCreateDate.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

form.elements.hasCustomHoldShelfLetter.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

form.elements.includeLogo.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

form.elements.includeCopyrightStatement.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

form.elements.includeAccessibilityStatement.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

form.elements.includeCustomMessage?.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

form.elements.accessibilityStatementMode?.addEventListener('change', () => {
  syncLetterSpecificQuestions();
});

generateAccessibilityStatementButton?.addEventListener('click', () => {
  updateAccessibilityStatementPreview();
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
    syncSelectedPreviewSample();
    syncPreviewSampleButtons();
    preview.textContent = '';
    renderedPreview.innerHTML = '';
  });
});

syncLetterSpecificQuestions();
syncSelectedPreviewSample();
syncPreviewSampleButtons();
