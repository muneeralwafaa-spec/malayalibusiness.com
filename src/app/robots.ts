import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/checkout', '/auth'],
      },
    ],
    sitemap: 'https://malayalibusiness.ae/sitemap.xml',
  }
}
