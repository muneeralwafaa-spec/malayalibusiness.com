import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { businessName, category, location, services, existingDescription } = await req.json()

    if (!businessName || !category) {
      return NextResponse.json({ error: 'Business name and category are required' }, { status: 400 })
    }

    const prompt = `You are a professional business copywriter for Malayalibusiness.com — the World's First AI-Powered Malayali Marketplace in the UAE.

Write a compelling business listing for the following:

Business Name: ${businessName}
Category: ${category}
Location: ${location || 'UAE'}
Services/Products: ${services || 'Not specified'}
${existingDescription ? `Existing Description: ${existingDescription}` : ''}

Generate:
1. A professional business description (3-4 sentences, highlight what makes them special, mention UAE/Malayali community connection)
2. A short punchy tagline (max 10 words)
3. 5 SEO keywords (comma separated, relevant to UAE market)

Format your response as JSON exactly like this:
{
  "description": "...",
  "tagline": "...",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
}

Keep the tone professional yet warm. Focus on trust, quality, and community. Do not use emojis.`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse AI response' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI generate-listing error:', error)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}
