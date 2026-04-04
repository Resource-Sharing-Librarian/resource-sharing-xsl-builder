
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <!-- ===== BEGIN: GENERAL SYSTEM CODE ===== -->
  <!-- DO NOT MODIFY ABOVE THIS LINE UNLESS EDITING SYSTEM CONFIG -->

  <xsl:include href="header.xsl" />
  <xsl:include href="senderReceiver.xsl" />
  <xsl:include href="mailReason.xsl" />
  <xsl:include href="footer.xsl" />
  <xsl:include href="style.xsl" />
  <xsl:include href="recordTitle.xsl" />

  <xsl:variable name="LIBRARY_LOGO_URL">@@LOGO_URL@@</xsl:variable>

  <!-- SECTION: Utility Spacing -->
  <xsl:template name="spacer">
    <tr><td><br /></td></tr>
  </xsl:template>

  <!-- =============================================================
       FAILSAFE TRUNCATION (prevents overflow from long metadata)
       NOTE: Addresses are NOT truncated (per requirement).
       Use truncate-text on titles/authors/other fields you want clipped.
       ============================================================= -->
  <xsl:template name="truncate-text">
    <xsl:param name="text" />
    <xsl:param name="max" select="100" />
    <xsl:param name="suffix" select="'...'" />
    <xsl:choose>
      <xsl:when test="string-length($text) &gt; $max">
        <xsl:value-of select="concat(substring($text, 1, $max), $suffix)" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- SECTION: External ID helpers -->
  <xsl:template name="id-info">
    <xsl:param name="line" />
    <xsl:variable name="rest" select="substring-after($line,'//')" />
    <xsl:choose>
      <xsl:when test="$rest != ''">
        <xsl:value-of select="$rest" /><br />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$line" /><br />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="id-info-hdr">
    <xsl:call-template name="id-info">
      <xsl:with-param name="line" select="notification_data/incoming_request/external_request_id" />
    </xsl:call-template>
  </xsl:template>

  <!-- SECTION: Location selection helper -->
  <xsl:template name="pick-location">
    <xsl:param name="avail" />
    <xsl:choose>
      <xsl:when test="normalize-space($avail/location_name) != ''">
        <xsl:value-of select="normalize-space($avail/location_name)" />
      </xsl:when>
      <xsl:when test="normalize-space(notification_data/organization_unit/name) != ''">
        <xsl:value-of select="normalize-space(notification_data/organization_unit/name)" />
      </xsl:when>
      <xsl:when test="normalize-space(notification_data/organization_unit/description) != ''">
        <xsl:value-of select="normalize-space(notification_data/organization_unit/description)" />
      </xsl:when>
      <xsl:when test="normalize-space(notification_data/organization_unit/address/city) != ''">
        <xsl:value-of select="normalize-space(notification_data/organization_unit/address/city)" />
      </xsl:when>
      <xsl:otherwise />
    </xsl:choose>
  </xsl:template>

  <!-- SECTION: Call number selection helper -->
  <xsl:template name="pick-call-number">
    <xsl:param name="avail" />
    <xsl:choose>
      <xsl:when test="normalize-space($avail/call_number) != ''">
        <xsl:value-of select="normalize-space($avail/call_number)" />
      </xsl:when>
      <xsl:when test="normalize-space(notification_data/metadata/call_number) != ''">
        <xsl:value-of select="normalize-space(notification_data/metadata/call_number)" />
      </xsl:when>
      <xsl:when test="contains(notification_data/incoming_request/request_metadata,'&lt;dc:rlterms_callNumber&gt;')">
        <xsl:value-of select="normalize-space(substring-before(substring-after(notification_data/incoming_request/request_metadata,'&lt;dc:rlterms_callNumber&gt;'),'&lt;/dc:rlterms_callNumber&gt;'))" />
      </xsl:when>
      <xsl:otherwise />
    </xsl:choose>
  </xsl:template>

  <!-- SECTION: Branding helper (ONE optional logo) -->
  <xsl:template name="print-library-logo">
    <xsl:variable name="logo" select="normalize-space($LIBRARY_LOGO_URL)" />

    <xsl:if test="$logo = '' or $logo = 'ADD LOGO URL HERE'">
      <table border="0" cellspacing="0" cellpadding="0" style="width:350px; max-width:350px; margin:0; border-collapse:collapse;">
        <tr><td height="24">&#160;</td></tr>
      </table>
    </xsl:if>

    <xsl:if test="$logo != '' and $logo != 'ADD LOGO URL HERE'">
      <table border="0" cellspacing="0" cellpadding="0" style="width:350px; max-width:350px; margin:0; border-collapse:collapse;">
        <tr><td height="12">&#160;</td></tr>
        <tr>
          <td align="center" style="text-align:center; width:350px;">
            <img src="{$logo}" alt="Library Logo" style="display:block; margin:0 auto; height:100px; width:auto; max-width:350px;" />
          </td>
        </tr>
        <tr><td height="12">&#160;</td></tr>
      </table>
    </xsl:if>
  </xsl:template>

  <xsl:template name="format-create-date">
    <xsl:param name="date" />
    <xsl:param name="format" select="'numerical'" />
    <xsl:param name="language" select="normalize-space(notification_data/languages/string)" />
    <xsl:choose>
      <xsl:when test="$format = 'numerical-europe' and string-length(normalize-space($date)) = 10">
        <xsl:value-of select="substring($date, 4, 2)" />
        <xsl:text>/</xsl:text>
        <xsl:value-of select="substring($date, 1, 2)" />
        <xsl:text>/</xsl:text>
        <xsl:value-of select="substring($date, 7, 4)" />
      </xsl:when>
      <xsl:when test="($format = 'readable' or $format = 'readable-europe') and string-length(normalize-space($date)) = 10">
        <xsl:variable name="month" select="substring($date, 1, 2)" />
        <xsl:variable name="day" select="substring($date, 4, 2)" />
        <xsl:variable name="year" select="substring($date, 7, 4)" />
        <xsl:variable name="lang">
          <xsl:choose>
            <xsl:when test="starts-with($language, 'fr')">fr</xsl:when>
            <xsl:when test="starts-with($language, 'es')">es</xsl:when>
            <xsl:when test="starts-with($language, 'de')">de</xsl:when>
            <xsl:when test="starts-with($language, 'it')">it</xsl:when>
            <xsl:otherwise>en</xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:if test="$format = 'readable-europe'">
          <xsl:value-of select="number($day)" />
          <xsl:text> </xsl:text>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="$lang = 'fr'">
            <xsl:choose>
              <xsl:when test="$month = '01'">janvier</xsl:when>
              <xsl:when test="$month = '02'">fevrier</xsl:when>
              <xsl:when test="$month = '03'">mars</xsl:when>
              <xsl:when test="$month = '04'">avril</xsl:when>
              <xsl:when test="$month = '05'">mai</xsl:when>
              <xsl:when test="$month = '06'">juin</xsl:when>
              <xsl:when test="$month = '07'">juillet</xsl:when>
              <xsl:when test="$month = '08'">aout</xsl:when>
              <xsl:when test="$month = '09'">septembre</xsl:when>
              <xsl:when test="$month = '10'">octobre</xsl:when>
              <xsl:when test="$month = '11'">novembre</xsl:when>
              <xsl:when test="$month = '12'">decembre</xsl:when>
            </xsl:choose>
          </xsl:when>
          <xsl:when test="$lang = 'es'">
            <xsl:choose>
              <xsl:when test="$month = '01'">enero</xsl:when>
              <xsl:when test="$month = '02'">febrero</xsl:when>
              <xsl:when test="$month = '03'">marzo</xsl:when>
              <xsl:when test="$month = '04'">abril</xsl:when>
              <xsl:when test="$month = '05'">mayo</xsl:when>
              <xsl:when test="$month = '06'">junio</xsl:when>
              <xsl:when test="$month = '07'">julio</xsl:when>
              <xsl:when test="$month = '08'">agosto</xsl:when>
              <xsl:when test="$month = '09'">septiembre</xsl:when>
              <xsl:when test="$month = '10'">octubre</xsl:when>
              <xsl:when test="$month = '11'">noviembre</xsl:when>
              <xsl:when test="$month = '12'">diciembre</xsl:when>
            </xsl:choose>
          </xsl:when>
          <xsl:when test="$lang = 'de'">
            <xsl:choose>
              <xsl:when test="$month = '01'">Januar</xsl:when>
              <xsl:when test="$month = '02'">Februar</xsl:when>
              <xsl:when test="$month = '03'">Marz</xsl:when>
              <xsl:when test="$month = '04'">April</xsl:when>
              <xsl:when test="$month = '05'">Mai</xsl:when>
              <xsl:when test="$month = '06'">Juni</xsl:when>
              <xsl:when test="$month = '07'">Juli</xsl:when>
              <xsl:when test="$month = '08'">August</xsl:when>
              <xsl:when test="$month = '09'">September</xsl:when>
              <xsl:when test="$month = '10'">Oktober</xsl:when>
              <xsl:when test="$month = '11'">November</xsl:when>
              <xsl:when test="$month = '12'">Dezember</xsl:when>
            </xsl:choose>
          </xsl:when>
          <xsl:when test="$lang = 'it'">
            <xsl:choose>
              <xsl:when test="$month = '01'">gennaio</xsl:when>
              <xsl:when test="$month = '02'">febbraio</xsl:when>
              <xsl:when test="$month = '03'">marzo</xsl:when>
              <xsl:when test="$month = '04'">aprile</xsl:when>
              <xsl:when test="$month = '05'">maggio</xsl:when>
              <xsl:when test="$month = '06'">giugno</xsl:when>
              <xsl:when test="$month = '07'">luglio</xsl:when>
              <xsl:when test="$month = '08'">agosto</xsl:when>
              <xsl:when test="$month = '09'">settembre</xsl:when>
              <xsl:when test="$month = '10'">ottobre</xsl:when>
              <xsl:when test="$month = '11'">novembre</xsl:when>
              <xsl:when test="$month = '12'">dicembre</xsl:when>
            </xsl:choose>
          </xsl:when>
          <xsl:otherwise>
            <xsl:choose>
              <xsl:when test="$month = '01'">January</xsl:when>
              <xsl:when test="$month = '02'">February</xsl:when>
              <xsl:when test="$month = '03'">March</xsl:when>
              <xsl:when test="$month = '04'">April</xsl:when>
              <xsl:when test="$month = '05'">May</xsl:when>
              <xsl:when test="$month = '06'">June</xsl:when>
              <xsl:when test="$month = '07'">July</xsl:when>
              <xsl:when test="$month = '08'">August</xsl:when>
              <xsl:when test="$month = '09'">September</xsl:when>
              <xsl:when test="$month = '10'">October</xsl:when>
              <xsl:when test="$month = '11'">November</xsl:when>
              <xsl:when test="$month = '12'">December</xsl:when>
            </xsl:choose>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:choose>
          <xsl:when test="$format = 'readable-europe'">
            <xsl:text> </xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:text> </xsl:text>
            <xsl:value-of select="number($day)" />
            <xsl:text>, </xsl:text>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:value-of select="$year" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$date" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- ===== END: GENERAL SYSTEM CODE ===== -->


  <!-- =====================================================================
       SECTION 01 - ROOT TEMPLATE (match="/")
       NOTE: Everything below is intended to be modular for swapping.
       ===================================================================== -->
  <xsl:template match="/">

    <!-- ===================================================================
         SECTION 02 - HTML DOCUMENT ROOT
         =================================================================== -->
    <html>
      <xsl:if test="notification_data/languages/string">
        <xsl:attribute name="lang">
          <xsl:value-of select="notification_data/languages/string" />
        </xsl:attribute>
      </xsl:if>

      <!-- ================================================================
           SECTION 03 - HEAD (TITLE + PRINT CSS)
           NOTE: The CSS below enforces "single page" behavior by hard-locking
                 the printable viewport. Content that exceeds height will CLIP.
           ================================================================ -->
      <head>
        <title><xsl:value-of select="notification_data/general_data/subject" /></title>

        <!-- ================================================================
             SECTION 03A - PRINT CSS (100% SINGLE-PAGE "PARANOID" MODE)
             ================================================================ -->
        <style type="text/css" media="print">
          @page { size: 3.75in 11in; margin: 0.20in; }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 3.35in !important;
            height: 10.6in !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            break-before: avoid-page !important;
            break-after: avoid-page !important;
          }

          .rsSlipOuter {
            width: 3.35in !important;
            height: 10.6in !important;
            border: 2px solid #000 !important;
            box-sizing: border-box !important;
            padding: 0.08in !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
          }

          .rsSlipInner {
            transform: scale(0.40);
            transform-origin: top left;
          }

          .rsSlip, .rsSlip * {
            box-sizing: border-box !important;
            max-width: 100% !important;
            overflow-wrap: anywhere !important;
            word-break: break-word !important;
            hyphens: auto !important;
          }

          .rsSlip, .rsSlip table, .rsSlip td, .rsSlip div, .rsSlip span {
            font-size: 12pt !important;
            line-height: 1.12 !important;
            font-family: inherit !important;
          }

          .rsSlip .emphBox { font-size: 14pt !important; line-height: 1.2 !important; }
          .rsSlip .locCall { font-size: 14pt !important; line-height: 1.2 !important; }
          .rsSlip .locCallValue { font-size: 16pt !important; line-height: 1.2 !important; }

          .rsSlip table {
            width: 100% !important;
            max-width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
          }

          .rsSlip td {
            padding-top: 1px !important;
            padding-bottom: 1px !important;
            vertical-align: top !important;
          }

          .rsSlip table.shippingLabel {
            width: 100% !important;
            max-width: 100% !important;
            border-collapse: collapse !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 16px !important;
            line-height: 1.1 !important;
            table-layout: fixed !important;
          }

          .rsSlip table.shippingLabel td {
            padding: 6px 8px !important;
            vertical-align: top !important;
            font-size: 16px !important;
          }

          .rsSlip table.shippingLabel center b,
          .rsSlip table.shippingLabel center {
            display: block !important;
            line-height: 1.05 !important;
            font-weight: bold !important;
          }

          .rsSlip img {
            max-width: 100% !important;
            height: auto !important;
            max-height: 1.2in !important;
          }

          .rsSlip tr, .rsSlip td, .rsSlip img {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .rsSlip br { line-height: 0.55 !important; }
        </style>
        <!-- ===== END SECTION 03A - PRINT CSS ===== -->
      </head>
      <!-- ===== END SECTION 03 - HEAD ===== -->


      <!-- ================================================================
           SECTION 04 - BODY ROOT
           NOTE: Contains outer border wrapper and scaled inner content.
           ================================================================ -->
      <body>

        <!-- ================================================================
             SECTION 05 - OUTER BORDER WRAPPER (NOT SCALED)
             ================================================================ -->
        <div class="rsSlipOuter">

          <!-- ==============================================================
               SECTION 06 - INNER SCALED CONTENT WRAPPER
               NOTE: This is scaled with transform; border remains full size.
               ============================================================= -->
          <div class="rsSlip rsSlipInner">

            <!-- ============================================================
                 SECTION 07 - MESSAGE CONTAINERS
                 ============================================================ -->
            <div class="messageArea">
              <div class="messageBody">

                <!-- ============================================================
                     SECTION 08 - HEADER BLOCK (PARTNER + POD + LOGO)
                     SWAP TARGET: Replace the entire SECTION 08 block to change
                     partner/pod presentation or alternate logo behavior.
                     ============================================================ -->
                <!-- ===== BEGIN SECTION 08 - PARTNER/POD/LOGO ===== -->
                <table border="0" cellspacing="0" cellpadding="0" style="width:350px; max-width:350px; table-layout:fixed;">
                  <tr>
                    <td style="font-size:14pt; width:350px;">
                      <strong>
                        <xsl:call-template name="truncate-text">
                          <xsl:with-param name="text" select="normalize-space(notification_data/partner_name)" />
                          <xsl:with-param name="max" select="60" />
                        </xsl:call-template>
                      </strong>
                    </td>
                  </tr>

                  <xsl:if test="normalize-space(notification_data/pod_name) != ''">
                    <tr>
                      <td style="width:350px;">
                        <b>Pod:&#160;</b>
                        <xsl:call-template name="truncate-text">
                          <xsl:with-param name="text" select="normalize-space(notification_data/pod_name)" />
                          <xsl:with-param name="max" select="60" />
                        </xsl:call-template>
                      </td>
                    </tr>
                  </xsl:if>

                  <xsl:if test="notification_data/partner_code = 'RapidILL'">
                    <tr><td style="width:350px;"><b>Pod:&#160;RapidR</b></td></tr>
                  </xsl:if>

                  <xsl:if test="normalize-space(notification_data/incoming_request/requester_email) != ''">
                    <tr>
                      <td style="width:350px;">
                        <b>@@requester_email@@:</b><xsl:text> </xsl:text><xsl:value-of select="notification_data/incoming_request/requester_email" />
                      </td>
                    </tr>
                  </xsl:if>

                  <!-- BEGIN OPTIONAL CREATE DATE -->
                  <xsl:if test="normalize-space(notification_data/incoming_request/create_date) != ''">
                    <tr>
                      <td style="width:350px;">
                        <b>Date:&#160;</b>
                        <xsl:call-template name="format-create-date">
                          <xsl:with-param name="date" select="notification_data/incoming_request/create_date" />
                          <xsl:with-param name="format" select="'@@CREATE_DATE_FORMAT@@'" />
                        </xsl:call-template>
                      </td>
                    </tr>
                  </xsl:if>
                  <!-- END OPTIONAL CREATE DATE -->
                </table>

                <!-- Logo for all printouts -->
                <xsl:call-template name="print-library-logo" />

                <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:350px; max-width:350px; table-layout:fixed;">
                  <tr>
                    <td style="width:350px;">
                      <div class="emphBox" style="border:2px solid #000; padding:6px;">
                        <div>
                          <b>Location:&#160;</b>
                          <span class="locCallValue">
                            <xsl:call-template name="pick-location">
                              <xsl:with-param name="avail" select="notification_data/items/physical_item_display_for_printing/available_items/available_item" />
                            </xsl:call-template>
                          </span>
                        </div>
                        <div>
                          <b>Call Number:&#160;</b>
                          <b class="locCallValue">
                            <xsl:call-template name="pick-call-number">
                              <xsl:with-param name="avail" select="notification_data/items/physical_item_display_for_printing/available_items/available_item" />
                            </xsl:call-template>
                          </b>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>

                <xsl:call-template name="spacer" />
                <!-- ===== END SECTION 08 - PARTNER/POD/LOGO ===== -->


                <!-- ============================================================
                     SECTION 09 - MAIN CONTENT TABLE WRAPPER
                     NOTE: Contains PHYSICAL and DIGITAL conditional blocks.
                     ============================================================ -->
                <!-- ===== BEGIN SECTION 09 - MAIN CONTENT TABLE ===== -->
                <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:350px; max-width:350px; table-layout:fixed;">

                  <!-- ==========================================================
                       SECTION 10 - PHYSICAL BLOCK (RS SLIP + SHIPPING LABEL)
                       SWAP TARGET: Replace entire SECTION 10 block if needed.
                       ========================================================== -->
                  <!-- ===== BEGIN SECTION 10 - PHYSICAL ===== -->
                  <xsl:if test="notification_data/incoming_request/format = 'PHYSICAL'">

                    <xsl:variable name="availItem"
                      select="notification_data/items/physical_item_display_for_printing/available_items/available_item" />

                    <xsl:if test="normalize-space(notification_data/metadata/title) != ''">
                      <tr>
                        <td style="width:350px;">
                          <b>Title:&#160;</b>
                          <xsl:call-template name="truncate-text">
                            <xsl:with-param name="text" select="normalize-space(notification_data/metadata/title)" />
                            <xsl:with-param name="max" select="100" />
                          </xsl:call-template>
                        </td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/author) != ''">
                      <tr>
                        <td style="width:350px;">
                          <b>Author:&#160;</b>
                          <xsl:call-template name="truncate-text">
                            <xsl:with-param name="text" select="normalize-space(notification_data/metadata/author)" />
                            <xsl:with-param name="max" select="90" />
                          </xsl:call-template>
                        </td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/volume) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@volume@@:&#160;</b><xsl:value-of select="notification_data/metadata/volume" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/issue) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@issue@@:&#160;</b><xsl:value-of select="notification_data/metadata/issue" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/pages) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@pages@@:&#160;</b><xsl:value-of select="notification_data/metadata/pages" /></td>
                      </tr>
                    </xsl:if>

                    <tr>
                      <td style="width:350px;"><b>@@borrower_reference@@:</b><xsl:text> </xsl:text><xsl:call-template name="id-info-hdr" /></td>
                    </tr>

                    <xsl:if test="normalize-space(notification_data/incoming_request/needed_by) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@date_needed_by@@:</b><xsl:text> </xsl:text><xsl:value-of select="notification_data/incoming_request/needed_by" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/incoming_request/note) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@request_note@@:</b><xsl:text> </xsl:text><xsl:value-of select="notification_data/incoming_request/note" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/oclc_number) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@oclc_number@@:&#160;</b><xsl:value-of select="notification_data/metadata/oclc_number" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/publication_date) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@year@@:&#160;</b><xsl:value-of select="notification_data/metadata/publication_date" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/publisher) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@publisher@@:&#160;</b><xsl:value-of select="notification_data/metadata/publisher" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/place_of_publication) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@place_of_publication@@:&#160;</b><xsl:value-of select="notification_data/metadata/place_of_publication" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="notification_data/items/physical_item_display_for_printing/shelving_location/string">
                      <tr>
                        <td style="width:350px;">
                          <b>@@shelving_location_for_item@@:</b>
                          <xsl:text> </xsl:text>
                          <xsl:for-each select="notification_data/items/physical_item_display_for_printing/shelving_location/string">
                            <xsl:value-of select="." />
                          </xsl:for-each>
                        </td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/edition) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@edition@@:&#160;</b><xsl:value-of select="notification_data/metadata/edition" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:if test="normalize-space(notification_data/metadata/isbn) != ''">
                      <tr>
                        <td style="width:350px;"><b>@@isbn@@:&#160;</b><xsl:value-of select="notification_data/metadata/isbn" /></td>
                      </tr>
                    </xsl:if>

                    <xsl:call-template name="spacer" />

                    <xsl:if test="normalize-space(notification_data/group_qualifier) != ''">
                      <tr><td style="width:350px;"><img src="cid:group_qualifier.png" alt="group_qualifier" /></td></tr>
                    </xsl:if>

                    <xsl:call-template name="spacer" />

                    <xsl:if test="normalize-space(notification_data/renewals_allowed) = 'false'">
                      <tr><td style="font-size:20px; width:350px;">NO RENEWALS</td></tr>
                      <xsl:call-template name="spacer" />
                    </xsl:if>

                    <!-- BEGIN OPTIONAL NOTE AREA -->
                    <tr>
                      <td style="width:350px;">
                        <b>Note:</b>
                        <div style="display:block; width:350px; border-bottom:1px solid #000; height:14px;"></div>
                      </td>
                    </tr>
                    <xsl:call-template name="spacer" />
                    <!-- END OPTIONAL NOTE AREA -->
                    <!-- ==========================================================
                         SECTION 10B — SHIPPING LABEL
                         NOTE: Addresses MUST remain full; do not truncate.
                         ========================================================== -->
                    <table class="shippingLabel" cellspacing="0" cellpadding="0" border="1">
                      <tr>
                        <tr>
                          <td style="font-size:12px;">
                            <b>Title: </b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/title)" />
                              <xsl:with-param name="max" select="80" />
                            </xsl:call-template>
                            <br />
                            <b>External ID: </b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/group_qualifier)" />
                              <xsl:with-param name="max" select="60" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </tr>

                      <tr>
                        <td style="font-size:16px;width:350px">
                          <font size="2">Return To: </font>
                          <br /><br />

                          <!-- FULL ADDRESS — NEVER TRUNCATE -->
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address1" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address2" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address3" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address4" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address5" /></b></center>
                          <center>
                            <b>
                              <xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/city" />
                              <xsl:text>, </xsl:text>
                              <xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/state" />
                              <xsl:text> </xsl:text>
                              <xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/postal_code" />
                            </b>
                          </center>

                          <br />
                        </td>
                      </tr>

                      <tr>
                        <td style="font-size:18px;width:350px">
                          <font size="2">Ship To: </font>
                          <br />
                          <xsl:choose>

                            <xsl:when test="notification_data/partner_code = 'RapidILL'">
                              <table>
                                <xsl:attribute name="style">
                                  <xsl:call-template name="listStyleCss" />
                                </xsl:attribute>

                                <!-- FULL ADDRESS — NEVER TRUNCATE -->
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line1" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line2" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line3" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line4" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line5" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/postal_code" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/country_display" /></b></center></td></tr>
                              </table>
                            </xsl:when>

                            <xsl:otherwise>
                              <!-- FULL ADDRESS — NEVER TRUNCATE -->
                              <center><b><xsl:value-of select="notification_data/partner_name" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line1" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line2" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line3" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line4" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line5" /></b></center>
                              <center>
                                <b>
                                  <xsl:value-of select="notification_data/borrowing_library_address/city" />
                                  <xsl:text>, </xsl:text>
                                  <xsl:value-of select="notification_data/borrowing_library_address/state_province" />
                                  <xsl:text> </xsl:text>
                                  <xsl:value-of select="notification_data/borrowing_library_address/postal_code" />
                                </b>
                              </center>
                              <br />
                            </xsl:otherwise>

                          </xsl:choose>
                        </td>
                      </tr>
                    </table>
                    <!-- ===== END SECTION 10B — SHIPPING LABEL ===== -->			
                    <!-- ==========================================================
                         SECTION 10B — Return LABEL 
                         ========================================================== -->
                    <table class="shippingLabel" cellspacing="0" cellpadding="0" border="1">
                      <tr>
                        <tr>
                          <td style="font-size:12px;">
                            <b>Title: </b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/title)" />
                              <xsl:with-param name="max" select="80" />
                            </xsl:call-template>
                            <br />
                            <b>External ID: </b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/group_qualifier)" />
                              <xsl:with-param name="max" select="60" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </tr>

                      <!-- ==========================================================
                           RETURN TO: BORROWING LIBRARY ADDRESS
                           ========================================================== -->
                      <tr>
                        <td style="font-size:16px;width:350px">
                          <font size="2">Return To: </font>
                          <br /><br />

                          <xsl:choose>

                            <xsl:when test="notification_data/partner_code = 'RapidILL'">
                              <table>
                                <xsl:attribute name="style">
                                  <xsl:call-template name="listStyleCss" />
                                </xsl:attribute>

                                <!-- FULL ADDRESS — NEVER TRUNCATE -->
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line1" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line2" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line3" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line4" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/line5" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/postal_code" /></b></center></td></tr>
                                <tr><td style="font-size:16px;width:350px"><center><b><xsl:value-of select="notification_data/borrowing_library_address/country_display" /></b></center></td></tr>
                              </table>
                            </xsl:when>

                            <xsl:otherwise>
                              <!-- FULL ADDRESS — NEVER TRUNCATE -->
                              <center><b><xsl:value-of select="notification_data/partner_name" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line1" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line2" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line3" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line4" /></b></center>
                              <center><b><xsl:value-of select="notification_data/borrowing_library_address/line5" /></b></center>
                              <center>
                                <b>
                                  <xsl:value-of select="notification_data/borrowing_library_address/city" />
                                  <xsl:text>, </xsl:text>
                                  <xsl:value-of select="notification_data/borrowing_library_address/state_province" />
                                  <xsl:text> </xsl:text>
                                  <xsl:value-of select="notification_data/borrowing_library_address/postal_code" />
                                </b>
                              </center>
                              <br />
                            </xsl:otherwise>

                          </xsl:choose>

                          <br />
                        </td>
                      </tr>

                      <!-- ==========================================================
                           SHIP TO: OWNING LIBRARY ADDRESS
                           ========================================================== -->
                      <tr>
                        <td style="font-size:18px;width:350px">
                          <font size="2">Ship To: </font>
                          <br /><br />

                          <!-- FULL ADDRESS — NEVER TRUNCATE -->
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address1" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address2" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address3" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address4" /></b></center>
                          <center><b><xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/address5" /></b></center>
                          <center>
                            <b>
                              <xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/city" />
                              <xsl:text>, </xsl:text>
                              <xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/state" />
                              <xsl:text> </xsl:text>
                              <xsl:value-of select="notification_data/items/physical_item_display_for_printing/owning_library_details/postal_code" />
                            </b>
                          </center>

                          <br />
                        </td>
                      </tr>

                    </table>
                    <!-- ===== END SECTION 10B - SHIPPING LABEL (SWAPPED) ===== -->					
                  </xsl:if>
                  <!-- ===== END SECTION 10 - PHYSICAL ===== -->


                  <!-- ==========================================================
                       SECTION 11 - DIGITAL WRAPPER
                       NOTE: Contains DIGITAL ARTICLE and DIGITAL BOOK blocks.
                       ========================================================== -->
                  <!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->
                  <xsl:if test="notification_data/incoming_request/format = 'DIGITAL'">

                    <!-- ========================================================
                         SECTION 11A - DIGITAL ARTICLE
                         ======================================================== -->
                    <xsl:if test="notification_data/metadata/material_type = 'Article'">

                      <xsl:if test="notification_data/partner_name">
                        <tr><td><img src="cid:externalId.png" alt="externalId" /></td></tr>
                      </xsl:if>

                      <tr><td /></tr>

                      <xsl:if test="normalize-space(notification_data/metadata/journal_title) != ''">
                        <tr>
                          <td>
                            <b>@@journal_title@@:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/journal_title)" />
                              <xsl:with-param name="max" select="100" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/normalized_title) != ''">
                        <tr>
                          <td>
                            <b>@@article_title@@:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/normalized_title)" />
                              <xsl:with-param name="max" select="100" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/author) != ''">
                        <tr>
                          <td>
                            <b>Author:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/author)" />
                              <xsl:with-param name="max" select="90" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/publication_date) != ''">
                        <tr><td><b>@@year@@:&#160;</b><xsl:value-of select="notification_data/metadata/publication_date" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/volume) != ''">
                        <tr><td><b>@@volume@@:&#160;</b><xsl:value-of select="notification_data/metadata/volume" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/issue) != ''">
                        <tr><td><b>@@issue@@:&#160;</b><xsl:value-of select="notification_data/metadata/issue" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/pages) != ''">
                        <tr><td><b>@@pages@@:&#160;</b><xsl:value-of select="notification_data/metadata/pages" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/issn) != ''">
                        <tr><td><b>@@issn@@:&#160;</b><xsl:value-of select="notification_data/metadata/issn" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/oclc_number) != ''">
                        <tr><td><b>@@oclc_number@@:&#160;</b><xsl:value-of select="notification_data/metadata/oclc_number" /></td></tr>
                      </xsl:if>

                      <tr><td><b>@@borrower_reference@@:</b><xsl:text> </xsl:text><xsl:call-template name="id-info-hdr" /></td></tr>

                      <xsl:if test="normalize-space(notification_data/incoming_request/needed_by) != ''">
                        <tr><td><b>@@date_needed_by@@:</b><xsl:text> </xsl:text><xsl:value-of select="notification_data/incoming_request/needed_by" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/incoming_request/note) != ''">
                        <tr><td><b>@@request_note@@:</b><xsl:text> </xsl:text><xsl:value-of select="notification_data/incoming_request/note" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/publisher) != ''">
                        <tr><td><b>@@publisher@@:&#160;</b><xsl:value-of select="notification_data/metadata/publisher" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/place_of_publication) != ''">
                        <tr><td><b>@@place_of_publication@@:&#160;</b><xsl:value-of select="notification_data/metadata/place_of_publication" /></td></tr>
                      </xsl:if>

                      <xsl:if test="notification_data/items = ''">
                        <tr><td style="font-size:20px">ELECTRONIC</td></tr>
                      </xsl:if>

                      <xsl:call-template name="spacer" />
                      <xsl:call-template name="spacer" />

                      <tr><td><img src="cid:resource_sharing_request_id.png" /></td></tr>
                    </xsl:if>
                    <!-- ===== END SECTION 11A - DIGITAL ARTICLE ===== -->


                    <!-- ========================================================
                         SECTION 11B - DIGITAL BOOK/CHAPTER
                         ======================================================== -->
                    <xsl:if test="notification_data/metadata/material_type = 'Book'">

                      <xsl:if test="notification_data/partner_name">
                        <tr><td><img src="cid:externalId.png" alt="externalId" /></td></tr>
                      </xsl:if>

                      <xsl:call-template name="spacer" />

                      <xsl:if test="normalize-space(notification_data/metadata/title) != ''">
                        <tr>
                          <td>
                            <b>Title:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/title)" />
                              <xsl:with-param name="max" select="100" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/author) != ''">
                        <tr>
                          <td>
                            <b>Author:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/author)" />
                              <xsl:with-param name="max" select="90" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/publication_date) != ''">
                        <tr><td><b>@@year@@:&#160;</b><xsl:value-of select="notification_data/metadata/publication_date" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/chapter) != ''">
                        <tr>
                          <td>
                            <b>@@chapter_number@@:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/chapter)" />
                              <xsl:with-param name="max" select="100" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/chapter_title) != ''">
                        <tr>
                          <td>
                            <b>@@chapter_title@@:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/chapter_title)" />
                              <xsl:with-param name="max" select="100" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/chapter_author) != ''">
                        <tr>
                          <td>
                            <b>@@chapter_author@@:&#160;</b>
                            <xsl:call-template name="truncate-text">
                              <xsl:with-param name="text" select="normalize-space(notification_data/metadata/chapter_author)" />
                              <xsl:with-param name="max" select="90" />
                            </xsl:call-template>
                          </td>
                        </tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/pages) != ''">
                        <tr><td><b>@@pages@@:&#160;</b><xsl:value-of select="notification_data/metadata/pages" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/publisher) != ''">
                        <tr><td><b>@@publisher@@:&#160;</b><xsl:value-of select="notification_data/metadata/publisher" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/place_of_publication) != ''">
                        <tr><td><b>@@place_of_publication@@:&#160;</b><xsl:value-of select="notification_data/metadata/place_of_publication" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/oclc_number) != ''">
                        <tr><td><b>@@oclc_number@@:&#160;</b><xsl:value-of select="notification_data/metadata/oclc_number" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/volume) != ''">
                        <tr><td><b>@@volume@@:&#160;</b><xsl:value-of select="notification_data/metadata/volume" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/metadata/issue) != ''">
                        <tr><td><b>@@issue@@:&#160;</b><xsl:value-of select="notification_data/metadata/issue" /></td></tr>
                      </xsl:if>

                      <tr><td><b>@@borrower_reference@@:</b><xsl:text> </xsl:text><xsl:call-template name="id-info-hdr" /></td></tr>

                      <xsl:if test="normalize-space(notification_data/incoming_request/needed_by) != ''">
                        <tr><td><b>@@date_needed_by@@:</b><xsl:text> </xsl:text><xsl:value-of select="notification_data/incoming_request/needed_by" /></td></tr>
                      </xsl:if>

                      <xsl:if test="normalize-space(notification_data/incoming_request/note) != ''">
                        <tr><td><b>@@request_note@@:</b><xsl:text> </xsl:text><xsl:value-of select="notification_data/incoming_request/note" /></td></tr>
                      </xsl:if>

                      <xsl:if test="notification_data/items = ''">
                        <tr><td style="font-size:20px">ELECTRONIC</td></tr>
                      </xsl:if>

                      <xsl:call-template name="spacer" />
                      <xsl:call-template name="spacer" />

                      <tr><td><img src="cid:resource_sharing_request_id.png" /></td></tr>
                    </xsl:if>
                    <!-- ===== END SECTION 11B - DIGITAL BOOK/CHAPTER ===== -->


                    <!-- ========================================================
                         SECTION 11C - COPYRIGHT NOTICE
                         ======================================================== -->
                    <xsl:call-template name="spacer" />
                    <tr>
                      <td>
                        <font size="1">
                          The copyright law of the United States (Title 17, United States Code), governs the making of photocopies or other reproductions of copyrighted material.
                          Under certain conditions specified in the law, libraries and archives are authorized to furnish a photocopy or other reproduction.
                          One of these specified conditions is that the photocopy or reproduction is not to be "used for any purpose other than private study, scholarship, or research."
                          If a user makes a request for, or later uses, a photocopy or reproduction for purposes in excess of "fair use," that user may be liable for copyright infringement.
                          This institution reserves the right to refuse to accept a copying order, if, in its judgment, fulfillment of the order would involve violation of copyright law.
                        </font>
                      </td>
                    </tr>
                    <!-- ===== END SECTION 11C - COPYRIGHT NOTICE ===== -->

                  </xsl:if>
                  <!-- ===== END SECTION 11 - DIGITAL ===== -->

                </table>
                <!-- ===== END SECTION 09 - MAIN CONTENT TABLE ===== -->

              </div>
            </div>

          </div>
        </div>
      </body>
    </html>

  </xsl:template>
  <!-- ===== END: SECTION 01 - ROOT TEMPLATE (match="/") ===== -->

</xsl:stylesheet>					


