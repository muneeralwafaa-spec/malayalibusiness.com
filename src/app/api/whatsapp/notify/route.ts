import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    const phone = process.env.ADMIN_WHATSAPP_NUMBER || '971505684147'
    const apikey = process.env.CALLMEBOT_API_KEY || ''

    if (!apikey) {
      console.warn('CALLMEBOT_API_KEY not set — WhatsApp notification skipped')
      return NextResponse.json({ success: false, reason: 'no_apikey' })
    }

    const encoded = encodeURIComponent(message)
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apikey}`
    const res = await fetch(url)
    const text = await res.text()

    return NextResponse.json({ success: res.ok, response: text })
  } catch (err) {
    console.error('WhatsApp notify error:', err)
    return NextResponse.json({ success: false })
  }
}
