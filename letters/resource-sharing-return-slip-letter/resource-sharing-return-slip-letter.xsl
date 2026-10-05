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
										<strong> Email: </strong>
										<xsl:value-of select="notification_data/partner_email/email"/>
									</td>
								</tr>
							</xsl:if>
							<!-- RETURN SLIP LOGO INSERTION POINT -->
							<tr>
								<td>
									<div style="width:350px; max-width:350px; text-align:center;">
										<img src="cid:externalId.png" alt="externalId" style="display:block; margin-left:63px; margin-right:0;"/>
									</div>
								</td>
							</tr>
							<!-- BEGIN OPTIONAL BOOK INFORMATION -->
							<xsl:if test="notification_data/request/display/title !='' or notification_data/request/display/journal_title !='' or notification_data/request/display/author !='' or notification_data/request/display/volume !='' or notification_data/request/display/issue !='' or notification_data/note_to_partner !=''">
								<tr>
									<td>
										<br/>
										<table role="presentation" cellspacing="0" cellpadding="5" border="0" style="width:350px; max-width:350px; border:2px solid #000; border-collapse:collapse;">
											<xsl:if test="notification_data/request/display/title !=''">
												<tr>
													<td>
														<strong> Title: </strong>
														<xsl:value-of select="notification_data/request/display/title"/>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="notification_data/request/display/journal_title !=''">
												<tr>
													<td>
														<strong> Journal Title: </strong>
														<xsl:value-of select="notification_data/request/display/journal_title"/>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="notification_data/request/display/author !=''">
												<tr>
													<td>
														<strong> Author: </strong>
														<xsl:value-of select="notification_data/request/display/author"/>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="notification_data/request/display/volume !=''">
												<tr>
													<td>
														<strong> Volume: </strong>
														<xsl:value-of select="notification_data/request/display/volume"/>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="notification_data/request/display/issue !=''">
												<tr>
													<td>
														<strong> Issue: </strong>
														<xsl:value-of select="notification_data/request/display/issue"/>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="notification_data/note_to_partner !=''">
												<tr>
													<td>
														<strong> Note to Partner: </strong>
														<xsl:value-of select="notification_data/note_to_partner"/>
													</td>
												</tr>
											</xsl:if>
										</table>
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
