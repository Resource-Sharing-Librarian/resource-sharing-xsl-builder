<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
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
          <table border="0" cellspacing="0" cellpadding="0" style="width:375px; max-width:375px; margin:0; border-collapse:collapse;">
             <tr><td height="12">&#160;</td></tr>
             <tr>
                <td align="center" style="text-align:center; width:375px;">
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
      <tr>
         <td><br /></td>
      </tr>
   </xsl:template>
   <xsl:template match="/">
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
         <body style="width: 375px !important; max-width: 375px !important; margin: 0; overflow-wrap: break-word !important;">
            <div class="messageArea">
               <div class="messageBody">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:375px; max-width:375px; border-collapse:collapse;">
                     <tr>
                        <td style="width:375px;">
                           <h1 style="margin:0 0 12px 0;">
                              <xsl:value-of select="notification_data/patron_name" />
                           </h1>
                        </td>
                     </tr>
                     <!-- BEGIN OPTIONAL PATRON ID -->
                     <tr>
                        <td style="width:375px;">
                           <b>Patron ID:</b>
                           <xsl:text> </xsl:text>
                           <xsl:value-of select="notification_data/patron_username" />
                        </td>
                     </tr>
                     <!-- END OPTIONAL PATRON ID -->
                     <!-- BEGIN OPTIONAL CREATE DATE -->
                     <xsl:if test="normalize-space(notification_data/request/item_arrival_date) != '' or normalize-space(notification_data/request/create_date) != ''">
                        <tr>
                           <td style="width:375px;">
                              <b>Received Date:&#160;</b>
                              <xsl:call-template name="format-create-date">
                                 <xsl:with-param name="date">
                                    <xsl:choose>
                                       <xsl:when test="normalize-space(notification_data/request/item_arrival_date) != ''">
                                          <xsl:value-of select="notification_data/request/item_arrival_date" />
                                       </xsl:when>
                                       <xsl:otherwise>
                                          <xsl:value-of select="notification_data/request/create_date" />
                                       </xsl:otherwise>
                                    </xsl:choose>
                                 </xsl:with-param>
                                 <xsl:with-param name="format" select="'@@CREATE_DATE_FORMAT@@'" />
                              </xsl:call-template>
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END OPTIONAL CREATE DATE -->
                     <tr>
                        <td style="width:375px; padding:10px 0 18px 0;">
                           <div style="width:375px; max-width:375px; border-top:1px solid #1f3b5c; height:0; line-height:0; font-size:0;"></div>
                        </td>
                     </tr>
                     <tr>
                        <td style="width:375px; text-align:left;">
                           <xsl:call-template name="print-library-logo" />
                        </td>
                     </tr>
                     <!-- BEGIN METADATA: title -->
                     <xsl:if test="notification_data/request/display/title != ''">
                        <tr>
                           <td style="width:375px; padding-top:8px;">
                              <b>Title:&#160;</b>
                              <xsl:value-of select="substring(notification_data/request/display/title, 1, 100)" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: title -->
                     <!-- BEGIN METADATA: author -->
                     <xsl:if test="not(notification_data/request/display/author='')">
                        <tr>
                           <td style="width:375px;">
                              <b>Author:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/author" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: author -->
                     <!-- BEGIN METADATA: volume -->
                     <xsl:if test="not(notification_data/request/display/volume='')">
                        <tr>
                           <td style="width:375px;">
                              <b>Volume:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/volume" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: volume -->
                     <!-- BEGIN METADATA: issue -->
                     <xsl:if test="not(notification_data/request/display/issue='')">
                        <tr>
                           <td style="width:375px;">
                              <b>Issue:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/issue" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: issue -->
                     <!-- BEGIN METADATA: isbn -->
                     <xsl:if test="not(notification_data/request/display/isbn='')">
                        <tr>
                           <td style="width:375px; padding-top:10px;">
                              <b>ISBN:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/isbn" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: isbn -->
                     <!-- BEGIN METADATA: oclc-number -->
                     <xsl:if test="not(notification_data/request/display/oclc_number='')">
                        <tr>
                           <td style="width:375px;">
                              <b>OCLC Number:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/oclc_number" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: oclc-number -->
                     <!-- BEGIN METADATA: place-of-publication -->
                     <xsl:if test="not(notification_data/request/display/place_of_publication='')">
                        <tr>
                           <td style="width:375px;">
                              <b>Place of Publication:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/place_of_publication" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: place-of-publication -->
                     <!-- BEGIN METADATA: publication-date -->
                     <xsl:if test="not(notification_data/request/display/publication_date='')">
                        <tr>
                           <td style="width:375px;">
                              <b>Publication Date:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/publication_date" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: publication-date -->
                     <!-- BEGIN METADATA: publisher -->
                     <xsl:if test="not(notification_data/request/display/publisher='')">
                        <tr>
                           <td style="width:375px;">
                              <b>Publisher:&#160;</b>
                              <xsl:value-of select="notification_data/request/display/publisher" />
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: publisher -->
                     <!-- BEGIN METADATA: part -->
                     <xsl:if test="normalize-space(notification_data/request/display/part) != '' or normalize-space(notification_data/request/part) != ''">
                        <tr>
                           <td style="width:375px;">
                              <b>Part:&#160;</b>
                              <xsl:choose>
                                 <xsl:when test="normalize-space(notification_data/request/display/part) != ''">
                                    <xsl:value-of select="notification_data/request/display/part" />
                                 </xsl:when>
                                 <xsl:otherwise>
                                    <xsl:value-of select="notification_data/request/part" />
                                 </xsl:otherwise>
                              </xsl:choose>
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: part -->
                     <!-- BEGIN METADATA: request-note -->
                     <xsl:if test="not(notification_data/request/display/note='') or not(notification_data/request/note='')">
                        <tr>
                           <td style="width:375px;">
                              <b>Note:&#160;</b>
                              <xsl:choose>
                                 <xsl:when test="not(notification_data/request/display/note='')">
                                    <xsl:value-of select="notification_data/request/display/note" />
                                 </xsl:when>
                                 <xsl:otherwise>
                                    <xsl:value-of select="notification_data/request/note" />
                                 </xsl:otherwise>
                              </xsl:choose>
                           </td>
                        </tr>
                     </xsl:if>
                     <!-- END METADATA: request-note -->
                     <xsl:if test="notification_data/group_qualifier !=''">
                        <tr>
                           <td style="width:375px; padding-top:8px;">
                              <b>External ID:&#160;</b>
                              <xsl:value-of select="notification_data/group_qualifier" />
                           </td>
                        </tr>
                     </xsl:if>
                     <xsl:if test="notification_data/barcode !=''">
                        <tr>
                           <td style="width:375px; text-align:center; font-size:18px; padding-bottom:12px;">
                              <img src="cid:Barcode.png" alt="Barcode" />
                           </td>
                        </tr>
                     </xsl:if>
                     <xsl:if test="translate(normalize-space(notification_data/renewals_allowed), 'TRUEFALS', 'truefals') = 'false'">
                        <tr>
                           <td style="width:375px; text-align:left; font-size:18px; padding:4px 0 14px 0;">
                              <font color="red">No Renewals</font>
                           </td>
                        </tr>
                     </xsl:if>
                     <xsl:if test="not(notification_data/pickup_library_name='')">
                       <tr>
                          <td style="width:375px; padding-top:8px;">
                             <strong>Pickup Location:&#160;</strong>
                             <xsl:value-of select="notification_data/pickup_library_name" />
                          </td>
                       </tr>
                     </xsl:if>
                     <!-- BEGIN OPTIONAL CUSTOM MESSAGE -->
                     <xsl:call-template name="spacer" />
                     <tr>
                        <td style="width:375px; padding-top:8px;">
                           CUSTOM MESSAGE
                        </td>
                     </tr>
                     <xsl:call-template name="spacer" />
                     <!-- END OPTIONAL CUSTOM MESSAGE -->
                     <!-- BEGIN OPTIONAL NOTE AREA -->
                      <tr>
                         <td style="width:375px;">
                            <b>Item Condition:_________________________________</b>
                         </td>
                      </tr>
                      <!-- END OPTIONAL NOTE AREA -->
                    </table>
                 </div>
              </div>
         </body>
      </html>
   </xsl:template>
</xsl:stylesheet>
