const BRAND_COLOR = '#1B4332'
const GOLD_COLOR = '#C9A84C'
const SITE_URL = 'https://www.malayalibusiness.com'

function baseLayout(content: string, previewText: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>${previewText}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND_COLOR} 0%,#2D6A4F 100%);padding:32px 40px;text-align:center;">
            <div style="color:${GOLD_COLOR};font-size:22px;font-weight:700;letter-spacing:1px;">Malayalibusiness.com</div>
            <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">World's First AI-Powered Malayali Marketplace</div>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:40px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;border-top:1px solid #eee;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:#888;font-size:12px;">Malayalibusiness.com â€” UAE's Malayali Community Marketplace</p>
            <p style="margin:0;color:#aaa;font-size:11px;">
              <a href="${SITE_URL}" style="color:${BRAND_COLOR};text-decoration:none;">Visit Website</a> &nbsp;|&nbsp;
              <a href="${SITE_URL}/directory" style="color:${BRAND_COLOR};text-decoration:none;">Directory</a> &nbsp;|&nbsp;
              <a href="${SITE_URL}/classifieds" style="color:${BRAND_COLOR};text-decoration:none;">Classifieds</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function button(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR},#2D6A4F);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;margin:8px 0;">${text}</a>`
}

function heading(text: string) {
  return `<h1 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:24px;font-weight:700;">${text}</h1>`
}

function para(text: string) {
  return `<p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">${text}</p>`
}

function infoBox(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px;color:#888;font-size:13px;font-weight:600;width:40%;">${label}</td>
    <td style="padding:8px 12px;color:#333;font-size:13px;">${value}</td>
  </tr>`
}

// â”€â”€ Email Templates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function welcomeEmail(name: string) {
  const content = `
    ${heading(`Welcome to Malayalibusiness.com, ${name}! ðŸŽ‰`)}
    ${para(`You've joined the <strong>World's First AI-Powered Malayali Marketplace</strong> in the UAE. We're thrilled to have you as part of our growing community.`)}
    ${para(`Here's what you can do right now:`)}
    <ul style="color:#444;font-size:15px;line-height:2;padding-left:20px;margin:0 0 24px;">
      <li>List your business and get discovered</li>
      <li>Browse 450+ Malayali businesses across the UAE</li>
      <li>Post classifieds, jobs, and events</li>
      <li>Connect with Malayali professionals</li>
    </ul>
    <div style="text-align:center;margin:32px 0;">
      ${button('Explore the Marketplace', `${SITE_URL}/en`)}
    </div>
    ${para(`If you have any questions, just reply to this email or chat with our AI assistant <strong>Sallu</strong> on the website.`)}
    ${para(`Welcome to the community! ðŸŒŸ<br/><strong>Team Malayalibusiness.com</strong>`)}
  `
  return {
    subject: `Welcome to Malayalibusiness.com, ${name}! ðŸŽ‰`,
    html: baseLayout(content, `Welcome to Malayalibusiness.com`),
  }
}

export function listingSubmittedEmail(ownerName: string, businessName: string, listingSlug: string) {
  const content = `
    ${heading('Listing Submitted Successfully!')}
    ${para(`Hi ${ownerName}, your business listing has been received and is now under review.`)}
    <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:10px;margin:16px 0 24px;overflow:hidden;">
      <tbody>
        ${infoBox('Business Name', businessName)}
        ${infoBox('Status', '<span style="color:#d97706;font-weight:600;">Under Review</span>')}
        ${infoBox('Review Time', 'Within 24 hours')}
      </tbody>
    </table>
    ${para(`Our team will review your listing and approve it within <strong>24 hours</strong>. You'll receive an email notification as soon as it goes live.`)}
    <div style="text-align:center;margin:32px 0;">
      ${button('View My Dashboard', `${SITE_URL}/dashboard`)}
    </div>
    ${para(`Thank you for listing with us!<br/><strong>Team Malayalibusiness.com</strong>`)}
  `
  return {
    subject: `Your listing "${businessName}" is under review`,
    html: baseLayout(content, `Listing submitted: ${businessName}`),
  }
}

export function listingApprovedEmail(ownerName: string, businessName: string, listingSlug: string) {
  const content = `
    ${heading('Your Listing is Live! ðŸŽ‰')}
    ${para(`Great news, ${ownerName}! Your business listing has been approved and is now live on Malayalibusiness.com.`)}
    <table style="width:100%;border-collapse:collapse;background:#f0fdf4;border-radius:10px;margin:16px 0 24px;overflow:hidden;border:1px solid #bbf7d0;">
      <tbody>
        ${infoBox('Business Name', businessName)}
        ${infoBox('Status', '<span style="color:#16a34a;font-weight:600;">âœ“ Live</span>')}
        ${infoBox('Visible to', 'All UAE Malayalis')}
      </tbody>
    </table>
    ${para(`Thousands of Malayalis across the UAE can now find and contact your business. Share your listing to get more visibility!`)}
    <div style="text-align:center;margin:32px 0;">
      ${button('View My Listing', `${SITE_URL}/company/${listingSlug}`)}
    </div>
    ${para(`Congratulations and best of luck with your business!<br/><strong>Team Malayalibusiness.com</strong>`)}
  `
  return {
    subject: `ðŸŽ‰ Your listing "${businessName}" is now live!`,
    html: baseLayout(content, `Listing approved: ${businessName}`),
  }
}

export function newEnquiryEmail(businessName: string, ownerEmail: string, senderName: string, senderEmail: string, senderPhone: string, message: string) {
  const content = `
    ${heading('New Enquiry Received!')}
    ${para(`You have a new enquiry for <strong>${businessName}</strong> on Malayalibusiness.com.`)}
    <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:10px;margin:16px 0 24px;overflow:hidden;">
      <tbody>
        ${infoBox('From', senderName)}
        ${infoBox('Email', `<a href="mailto:${senderEmail}" style="color:${BRAND_COLOR};">${senderEmail}</a>`)}
        ${infoBox('Phone', senderPhone || 'Not provided')}
      </tbody>
    </table>
    <div style="background:#f9f9f9;border-left:4px solid ${GOLD_COLOR};padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="margin:0;color:#333;font-size:14px;line-height:1.7;font-style:italic;">"${message}"</p>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="mailto:${senderEmail}" style="display:inline-block;background:${GOLD_COLOR};color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;margin:8px;">Reply by Email</a>
      ${senderPhone ? `<a href="https://wa.me/${senderPhone.replace(/\D/g, '')}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;margin:8px;">Reply on WhatsApp</a>` : ''}
    </div>
    ${para(`<strong>Team Malayalibusiness.com</strong>`)}
  `
  return {
    subject: `New enquiry for ${businessName} from ${senderName}`,
    html: baseLayout(content, `New enquiry: ${businessName}`),
  }
}

export function newListingAdminEmail(businessName: string, ownerName: string, ownerEmail: string, emirate: string, category: string) {
  const content = `
    ${heading('New Listing Awaiting Approval')}
    ${para(`A new business listing has been submitted and requires your approval.`)}
    <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border-radius:10px;margin:16px 0 24px;overflow:hidden;">
      <tbody>
        ${infoBox('Business Name', businessName)}
        ${infoBox('Owner', ownerName)}
        ${infoBox('Email', ownerEmail)}
        ${infoBox('Emirate', emirate)}
        ${infoBox('Category', category)}
        ${infoBox('Status', '<span style="color:#d97706;font-weight:600;">Pending Approval</span>')}
      </tbody>
    </table>
    <div style="text-align:center;margin:32px 0;">
      ${button('Review in Admin Panel', `${SITE_URL}/admin`)}
    </div>
  `
  return {
    subject: `New listing pending approval: ${businessName}`,
    html: baseLayout(content, `New listing: ${businessName}`),
  }
}

export function classifiedPostedEmail(userName: string, title: string, classifiedId: string) {
  const content = `
    ${heading('Your Classified Ad is Live!')}
    ${para(`Hi ${userName}, your classified ad has been posted successfully on Malayalibusiness.com.`)}
    <table style="width:100%;border-collapse:collapse;background:#f0fdf4;border-radius:10px;margin:16px 0 24px;overflow:hidden;border:1px solid #bbf7d0;">
      <tbody>
        ${infoBox('Ad Title', title)}
        ${infoBox('Status', '<span style="color:#16a34a;font-weight:600;">âœ“ Live</span>')}
      </tbody>
    </table>
    ${para(`Your ad is now visible to the Malayali community across the UAE.`)}
    <div style="text-align:center;margin:32px 0;">
      ${button('View My Ad', `${SITE_URL}/classifieds/${classifiedId}`)}
    </div>
    ${para(`<strong>Team Malayalibusiness.com</strong>`)}
  `
  return {
    subject: `Your classified "${title}" is now live!`,
    html: baseLayout(content, `Classified posted: ${title}`),
  }
}

