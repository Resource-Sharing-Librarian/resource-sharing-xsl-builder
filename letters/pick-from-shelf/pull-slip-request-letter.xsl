<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:include href="header.xsl" />
<xsl:include href="senderReceiver.xsl" />
<xsl:include href="mailReason.xsl" />
<xsl:include href="footer.xsl" />
<xsl:include href="style.xsl" />
<xsl:include href="recordTitle.xsl" />
<xsl:variable name="LIBRARY_LOGO_URL">@@LOGO_URL@@</xsl:variable>

<xsl:template name="print-library-logo">
   <xsl:variable name="logo" select="normalize-space($LIBRARY_LOGO_URL)" />
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
   <xsl:choose>
      <xsl:when test="$format = 'numerical-europe' and string-length(normalize-space($date)) = 10">
         <xsl:value-of select="substring($date, 4, 2)" />
         <xsl:text>/</xsl:text>
         <xsl:value-of select="substring($date, 1, 2)" />
         <xsl:text>/</xsl:text>
         <xsl:value-of select="substring($date, 7, 4)" />
      </xsl:when>
      <xsl:when test="$format = 'readable' and string-length(normalize-space($date)) = 10">
         <xsl:call-template name="month-name">
            <xsl:with-param name="month" select="substring($date, 1, 2)" />
         </xsl:call-template>
         <xsl:text> </xsl:text>
         <xsl:value-of select="number(substring($date, 4, 2))" />
         <xsl:text>, </xsl:text>
         <xsl:value-of select="substring($date, 7, 4)" />
      </xsl:when>
      <xsl:when test="$format = 'readable-europe' and string-length(normalize-space($date)) = 10">
         <xsl:value-of select="number(substring($date, 4, 2))" />
         <xsl:text> </xsl:text>
         <xsl:call-template name="month-name">
            <xsl:with-param name="month" select="substring($date, 1, 2)" />
         </xsl:call-template>
         <xsl:text> </xsl:text>
         <xsl:value-of select="substring($date, 7, 4)" />
      </xsl:when>
      <xsl:otherwise>
         <xsl:value-of select="$date" />
      </xsl:otherwise>
   </xsl:choose>
</xsl:template>

<xsl:template name="month-name">
   <xsl:param name="month" />
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
</xsl:template>

<xsl:template name="spacer">
   <tr><td><br /></td></tr>
</xsl:template>
<xsl:template match="/">

      <xsl:choose>
         <xsl:when test="notification_data/group_qualifier='' ">

<!-- Start Add Your Local Circ Customizations Here Starting with <html> --> 

<!-- End Local Circ Customizations ending with </html> --> 

         </xsl:when>
         <xsl:otherwise>
            <html>
               <xsl:if test="notification_data/languages/string">
                  <xsl:attribute name="lang">
                     <xsl:value-of select="notification_data/languages/string" />
                  </xsl:attribute>
               </xsl:if>
               <head>
                  <title>
                     <xsl:value-of select="notification_data/general_data/subject" />
                  </title>
               </head>
               <body style="width: 50vw !important; overflow-wrap: break-word !important;">
                  <div class="messageArea">
                     <div class="messageBody">
                        <!-- ===== BEGIN SECTION 08 - PARTNER/POD/LOGO ===== -->
                        <table border="0" cellspacing="0" cellpadding="0" style="width:350px; max-width:350px; table-layout:fixed;">
                           <tr>
                              <td style="font-size:14pt; width:350px;">
                                 <strong><xsl:value-of select="notification_data/partner_name" /></strong>
                              </td>
                           </tr>
                           <xsl:if test="normalize-space(notification_data/pod_name) != ''">
                              <tr>
                                 <td style="width:350px;">
                                    <b>Pod:&#160;</b>
                                    <xsl:value-of select="notification_data/pod_name" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- BEGIN OPTIONAL PARTNER EMAIL -->
                           <xsl:if test="normalize-space(notification_data/incoming_request/requester_email) != ''">
                              <tr>
                                 <td style="width:350px;">
                                    <b>@@requester_email@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/incoming_request/requester_email" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END OPTIONAL PARTNER EMAIL -->
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
                        <xsl:call-template name="print-library-logo" />
                        <table role="presentation" cellspacing="0" cellpadding="2" border="0" style="width:350px; max-width:350px; table-layout:fixed;">
                           <tr>
                              <td style="width:350px;">
                                 <div class="emphBox" style="border:2px solid #000; padding:6px;">
                                    <div>
                                       <b>Location:&#160;</b>
                                       <span class="locCallValue">
                                          <xsl:value-of select="notification_data/phys_item_display/location_name" />
                                       </span>
                                    </div>
                                    <div>
                                       <b>Call Number:&#160;</b>
                                       <b class="locCallValue">
                                          <xsl:value-of select="notification_data/phys_item_display/call_number" />
                                       </b>
                                    </div>
                                 </div>
                              </td>
                           </tr>
                        </table>
                        <!-- ===== END SECTION 08 - PARTNER/POD/LOGO ===== -->
                        <!-- ===== BEGIN SECTION 10 - PHYSICAL ===== -->
                        <table role="presentation" cellspacing="0" cellpadding="5" border="0">
                           <xsl:if test="notification_data/request/manual_description != ''">
                              <tr>
                                 <td>
                                    <strong>@@please_note@@:</strong>
                                          <xsl:text> </xsl:text>
                                    @@manual_description_note@@ -
                                          <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/request/manual_description" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <xsl:if test="notification_data/proxy_requester/name">
                              <tr>
                                 <td>
                                    <strong>@@proxy_requester@@:</strong>
                                          <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/proxy_requester/name" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- BEGIN METADATA: title -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/title) != ''">
                              <tr>
                                 <td>
                                    <b>@@title@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/phys_item_display/title" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: title -->
                           <!-- BEGIN METADATA: author -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/author) != ''">
                              <tr>
                                 <td>
                                    <b>@@author@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/phys_item_display/author" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: author -->
                           <!-- BEGIN METADATA: publication-date -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/publication_date) != ''">
                              <tr>
                                 <td>
                                    <b>@@year@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/phys_item_display/publication_date" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: publication-date -->
                           <!-- BEGIN METADATA: volume -->
                           <xsl:if test="normalize-space(notification_data/metadata/volume) != '' or normalize-space(notification_data/request/volume) != ''">
                              <tr>
                                 <td>
                                    <b>@@volume@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/metadata/volume) != ''">
                                          <xsl:value-of select="notification_data/metadata/volume" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/request/volume" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: volume -->
                           <!-- BEGIN METADATA: issue -->
                           <xsl:if test="normalize-space(notification_data/metadata/issue) != '' or normalize-space(notification_data/request/issue) != '' or normalize-space(notification_data/phys_item_display/issue_level_description) != ''">
                              <tr>
                                 <td>
                                    <b>@@issue@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/metadata/issue) != ''">
                                          <xsl:value-of select="notification_data/metadata/issue" />
                                       </xsl:when>
                                       <xsl:when test="normalize-space(notification_data/request/issue) != ''">
                                          <xsl:value-of select="notification_data/request/issue" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/phys_item_display/issue_level_description" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: issue -->
                           <!-- BEGIN METADATA: pages -->
                           <xsl:if test="normalize-space(notification_data/request/pages) != '' or normalize-space(notification_data/metadata/pages) != ''">
                              <tr>
                                 <td>
                                    <b>@@pages@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/request/pages) != ''">
                                          <xsl:value-of select="notification_data/request/pages" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/metadata/pages" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: pages -->
                           <!-- BEGIN METADATA: publisher -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/publisher) != ''">
                              <tr>
                                 <td>
                                    <b>@@publisher@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/phys_item_display/publisher" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: publisher -->
                           <!-- BEGIN METADATA: place-of-publication -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/publication_place) != ''">
                              <tr>
                                 <td>
                                    <b>@@place_of_publication@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/phys_item_display/publication_place" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: place-of-publication -->
                           <!-- BEGIN METADATA: oclc-number -->
                           <xsl:if test="contains(notification_data/metadata,'&lt;dc:oclc_number&gt;')">
                              <tr>
                                 <td>
                                    <b>@@oclc_number@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="substring-before(substring-after(notification_data/metadata,'&lt;dc:oclc_number&gt;'),'&lt;/dc:oclc_number&gt;')" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: oclc-number -->
                           <!-- BEGIN METADATA: edition -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/edition) != ''">
                              <tr>
                                 <td>
                                    <b>@@edition@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/phys_item_display/edition" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: edition -->
                           <!-- BEGIN METADATA: isbn -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/isbn) != ''">
                              <tr>
                                 <td>
                                    <b>@@isbn@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/phys_item_display/isbn" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: isbn -->
                           <!-- BEGIN METADATA: issn -->
                           <xsl:if test="normalize-space(notification_data/phys_item_display/issn) != '' or normalize-space(notification_data/metadata/issn) != ''">
                              <tr>
                                 <td>
                                    <b>@@issn@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/phys_item_display/issn) != ''">
                                          <xsl:value-of select="notification_data/phys_item_display/issn" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/metadata/issn" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: issn -->
                           <!-- BEGIN METADATA: borrower-reference -->
                           <xsl:if test="normalize-space(notification_data/incoming_request/external_request_id) != ''">
                              <tr>
                                 <td>
                                    <b>@@borrower_reference@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/incoming_request/external_request_id" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: borrower-reference -->
                           <!-- BEGIN METADATA: chapter-number -->
                           <xsl:if test="normalize-space(notification_data/metadata/chapter) != ''">
                              <tr>
                                 <td>
                                    <b>@@chapter_number@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="notification_data/metadata/chapter" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: chapter-number -->
                           <!-- BEGIN METADATA: chapter-title -->
                           <xsl:if test="normalize-space(notification_data/request/chapter_article_title) != '' or normalize-space(notification_data/metadata/chapter_title) != ''">
                              <tr>
                                 <td>
                                    <b>@@chapter_title@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/request/chapter_article_title) != ''">
                                          <xsl:value-of select="notification_data/request/chapter_article_title" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/metadata/chapter_title" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: chapter-title -->
                           <!-- BEGIN METADATA: chapter-author -->
                           <xsl:if test="normalize-space(notification_data/request/chapter_article_author) != '' or normalize-space(notification_data/metadata/chapter_author) != ''">
                              <tr>
                                 <td>
                                    <b>@@chapter_author@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/request/chapter_article_author) != ''">
                                          <xsl:value-of select="notification_data/request/chapter_article_author" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/metadata/chapter_author" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: chapter-author -->
                           <!-- BEGIN METADATA: journal-title -->
                           <xsl:if test="normalize-space(notification_data/incoming_request/journal_title) != '' or normalize-space(notification_data/metadata/journal_title) != ''">
                              <tr>
                                 <td>
                                    <b>@@journal_title@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/incoming_request/journal_title) != ''">
                                          <xsl:value-of select="notification_data/incoming_request/journal_title" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/metadata/journal_title" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: journal-title -->
                           <!-- BEGIN METADATA: article-title -->
                           <xsl:if test="normalize-space(notification_data/metadata/normalized_title) != '' or normalize-space(notification_data/request/chapter_article_title) != ''">
                              <tr>
                                 <td>
                                    <b>@@article_title@@:</b>
                                    <xsl:text> </xsl:text>
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/metadata/normalized_title) != ''">
                                          <xsl:value-of select="notification_data/metadata/normalized_title" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/request/chapter_article_title" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- END METADATA: article-title -->
                           <xsl:if test="notification_data/request/work_flow_entity/expiration_date != ''">
                              <tr>
                                 <td>
                                 </td>
                              </tr>

                           </xsl:if>
                           <xsl:if test="notification_data/request/selected_inventory_type='ITEM'">
                              <tr>
                                 <td>
                                    <img src="cid:group_qualifier.png" alt="group_qualifier" />
                                 </td>
                              </tr>
                           </xsl:if>
                           <!-- BEGIN OPTIONAL CUSTOM MESSAGE -->
                           <tr>
                              <td>@@CUSTOM_MESSAGE@@</td>
                           </tr>
                           <xsl:call-template name="spacer" />
                           <!-- END OPTIONAL CUSTOM MESSAGE -->
                           <!-- BEGIN OPTIONAL NOTE AREA -->
                           <tr>
                              <td>
                                 <b>Note:</b>
                                 <div style="display:block; width:350px; border-bottom:1px solid #000; height:14px;"></div>
                              </td>
                           </tr>
                           <xsl:call-template name="spacer" />
                           <!-- END OPTIONAL NOTE AREA -->
                           <!-- ==========================================================
                                SECTION 10B - SHIPPING LABEL
                                NOTE: Addresses MUST remain full; do not truncate.
                                ========================================================== -->
                           <table class="shippingLabel" cellspacing="0" cellpadding="0" border="1">
                              <tr>
                                 <td style="font-size:12px;">
                                    <b>Title: </b>
                                    <xsl:value-of select="notification_data/phys_item_display/title" />
                                    <br />
                                    <b>Borrower Reference: </b>
                                    <xsl:value-of select="notification_data/incoming_request/external_request_id" />
                                 </td>
                              </tr>
                              <tr>
                                 <td style="font-size:16px;width:350px">
                                    <font size="2">Return To: </font>
                                    <br />
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address1" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address2" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address3" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address4" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address5" /></b></center>
                                    <center>
                                       <b>
                                          <xsl:value-of select="notification_data/phys_item_display/owning_library_details/city" />
                                          <xsl:text>, </xsl:text>
                                          <xsl:value-of select="notification_data/phys_item_display/owning_library_details/state" />
                                          <xsl:text> </xsl:text>
                                          <xsl:value-of select="notification_data/phys_item_display/owning_library_details/postal_code" />
                                       </b>
                                    </center>
                                    <br />
                                 </td>
                              </tr>
                              <tr>
                                 <td style="font-size:18px;width:350px">
                                    <font size="2">Ship To: </font>
                                    <br />
                                    <center><b><xsl:value-of select="notification_data/partner_name" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address1" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address2" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address3" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address4" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address5" /></b></center>
                                    <center>
                                       <b>
                                          <xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/city" />
                                          <xsl:text>, </xsl:text>
                                          <xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/state" />
                                          <xsl:text> </xsl:text>
                                          <xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/postal_code" />
                                       </b>
                                    </center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/country" /></b></center>
                                    <br />
                                 </td>
                              </tr>
                           </table>
                           <!-- ===== END SECTION 10B - SHIPPING LABEL ===== -->
                           <!-- ==========================================================
                                SECTION 10B - SHIPPING LABEL (SWAPPED)
                                ========================================================== -->
                           <table class="shippingLabel" cellspacing="0" cellpadding="0" border="1">
                              <tr>
                                 <td style="font-size:12px;">
                                    <b>Title: </b>
                                    <xsl:value-of select="notification_data/phys_item_display/title" />
                                    <br />
                                    <b>Borrower Reference: </b>
                                    <xsl:value-of select="notification_data/incoming_request/external_request_id" />
                                 </td>
                              </tr>
                              <tr>
                                 <td style="font-size:16px;width:350px">
                                    <font size="2">Return To: </font>
                                    <br />
                                    <center><b><xsl:value-of select="notification_data/partner_name" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address1" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address2" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address3" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address4" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/address5" /></b></center>
                                    <center>
                                       <b>
                                          <xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/city" />
                                          <xsl:text>, </xsl:text>
                                          <xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/state" />
                                          <xsl:text> </xsl:text>
                                          <xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/postal_code" />
                                       </b>
                                    </center>
                                    <center><b><xsl:value-of select="notification_data/partner_shipping_info_list/partner_shipping_info/country" /></b></center>
                                    <br />
                                 </td>
                              </tr>
                              <tr>
                                 <td style="font-size:18px;width:350px">
                                    <font size="2">Ship To: </font>
                                    <br />
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address1" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address2" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address3" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address4" /></b></center>
                                    <center><b><xsl:value-of select="notification_data/phys_item_display/owning_library_details/address5" /></b></center>
                                    <center>
                                       <b>
                                          <xsl:value-of select="notification_data/phys_item_display/owning_library_details/city" />
                                          <xsl:text>, </xsl:text>
                                          <xsl:value-of select="notification_data/phys_item_display/owning_library_details/state" />
                                          <xsl:text> </xsl:text>
                                          <xsl:value-of select="notification_data/phys_item_display/owning_library_details/postal_code" />
                                       </b>
                                    </center>
                                    <br />
                                 </td>
                              </tr>
                           </table>
                           <!-- ===== END SECTION 10B - SHIPPING LABEL (SWAPPED) ===== -->
                           </table>
                           <!-- ===== END SECTION 10 - PHYSICAL ===== -->
                           <!-- ===== BEGIN SECTION 11 - DIGITAL ===== -->
                           <!-- ===== END SECTION 11 - DIGITAL ===== -->
                     </div>
                  </div>
               </body>
            </html>
         </xsl:otherwise>
      </xsl:choose>

	</xsl:template>
</xsl:stylesheet>
