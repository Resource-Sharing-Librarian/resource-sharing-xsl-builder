<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:include href="header.xsl"/>
	<xsl:include href="senderReceiver.xsl"/>
	<xsl:include href="mailReason.xsl"/>
	<xsl:include href="footer.xsl"/>
	<xsl:include href="style.xsl"/>
	<xsl:include href="recordTitle.xsl"/>
	<xsl:template match="/">
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

				<xsl:call-template name="generalStyle"/>
			</head>
			<body>
				<xsl:attribute name="style">
					<xsl:call-template name="bodyStyleCss"/>
					<!-- style.xsl -->
				</xsl:attribute>

				<div class="messageArea">
					<div class="messageBody">
						<!-- BEGIN RETURN SLIP CONTENT -->
						<table role='presentation'  cellspacing="0" cellpadding="5" border="0">
							<xsl:attribute name="style">
								<xsl:call-template name="listStyleCss"/>
								<!-- style.xsl -->
							</xsl:attribute>
							<tr>
								<td>
									<strong style="font-size:2em;">Return to Lending Library</strong>
								</td>
							</tr>
							<tr>
								<td>
								<br/>
									<strong>Return To: </strong>
									<xsl:value-of select="notification_data/partner_name"/>
								</td>
							</tr>
							<xsl:if test="notification_data/request/return_info !=''">
								<tr>
									<td>
										<xsl:value-of select="notification_data/request/return_info"/>
									</td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/partner_email/email !=''">
								<tr>
									<td>
										<strong> @@email@@: </strong>
										<xsl:value-of select="notification_data/partner_email/email"/>
									</td>
								</tr>
							</xsl:if>
							<!-- RETURN SLIP LOGO INSERTION POINT -->
							<xsl:if test="notification_data/partner_phone/phone !=''">
								<tr>
									<td>
										<strong> @@phone@@: </strong>
										<xsl:value-of select="notification_data/partner_phone/phone"/>
									</td>
								</tr>
							</xsl:if>
							<tr>
								<td><img src="externalId.png" alt="externalId"/></td>
							</tr>
							<!-- BEGIN OPTIONAL BOOK INFORMATION -->
							<tr><td><br/></td></tr>
							<xsl:if test="notification_data/request/display/title !=''">
								<tr>
									<td>
										<strong> @@title@@: </strong>
										<xsl:value-of select="notification_data/request/display/title"/>
									</td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/request/display/journal_title !=''">
								<tr>
									<td>
										<strong> @@journal_title@@: </strong>
										<xsl:value-of select="notification_data/request/display/journal_title"/>
									</td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/request/display/author !=''">
								<tr>
									<td>
										<strong> @@author@@: </strong>
										<xsl:value-of select="notification_data/request/display/author"/>
									</td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/request/display/volume !=''">
								<tr>
									<td>
										<strong> @@volume@@: </strong>
										<xsl:value-of select="notification_data/request/display/volume"/>
									</td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/request/display/issue !=''">
								<tr>
									<td>
										<strong> @@issue@@: </strong>
										<xsl:value-of select="notification_data/request/display/issue"/>
									</td>
								</tr>
							</xsl:if>
							<xsl:if test="notification_data/note_to_partner !=''">
								<tr>
									<td>
										<br/>
										<strong> @@note_to_partner@@: </strong>
										<xsl:value-of select="notification_data/note_to_partner"/>
									</td>
								</tr>
							</xsl:if>
							<!-- END OPTIONAL BOOK INFORMATION -->
						</table>
						<!-- END RETURN SLIP CONTENT -->
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
