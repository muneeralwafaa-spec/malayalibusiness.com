import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendAdminEmail } from '@/lib/emails/send'
import {
  welcomeEmail,
  listingSubmittedEmail,
  listingApprovedEmail,
  newEnquiryEmail,
  newListingAdminEmail,
  classifiedPostedEmail,
} from '@/lib/emails/templates'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type } = body

    switch (type) {
      case 'welcome': {
        const { to, name } = body
        const { subject, html } = welcomeEmail(name)
        await sendEmail(to, subject, html)
        break
      }
      case 'listing_submitted': {
        const { to, ownerName, businessName, listingSlug, emirate, category, ownerEmail } = body
        const { subject, html } = listingSubmittedEmail(ownerName, businessName, listingSlug)
        await sendEmail(to, subject, html)
        // Also notify admin
        const admin = newListingAdminEmail(businessName, ownerName, ownerEmail || to, emirate || '', category || '')
        await sendAdminEmail(admin.subject, admin.html)
        break
      }
      case 'listing_approved': {
        const { to, ownerName, businessName, listingSlug } = body
        const { subject, html } = listingApprovedEmail(ownerName, businessName, listingSlug)
        await sendEmail(to, subject, html)
        break
      }
      case 'new_enquiry': {
        const { to, businessName, senderName, senderEmail, senderPhone, message } = body
        const { subject, html } = newEnquiryEmail(businessName, to, senderName, senderEmail, senderPhone, message)
        await sendEmail(to, subject, html)
        break
      }
      case 'classified_posted': {
        const { to, userName, title, classifiedId } = body
        const { subject, html } = classifiedPostedEmail(userName, title, classifiedId)
        await sendEmail(to, subject, html)
        break
      }
      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email API error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
