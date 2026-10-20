import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.NEXT_PUBLIC_FROM_EMAIL || 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'muneer@alwafaagroup.com'

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) console.error('Resend error:', error)
    return { success: !error, data }
  } catch (err) {
    console.error('sendEmail failed:', err)
    return { success: false }
  }
}

export async function sendAdminEmail(subject: string, html: string) {
  return sendEmail(ADMIN_EMAIL, subject, html)
}
