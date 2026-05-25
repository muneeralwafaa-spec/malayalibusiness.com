import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://www.malayalibusiness.com'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseUrl, supabaseAnon)

  // ── Static pages ──────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/en`,              lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE_URL}/ml`,              lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/en/directory`,    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/ml/directory`,    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/en/events`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/ml/events`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/en/jobs`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/ml/jobs`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/en/classifieds`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/ml/classifieds`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE_URL}/en/shop`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/ml/shop`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE_URL}/en/community`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE_URL}/ml/community`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${BASE_URL}/en/businessmen`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE_URL}/ml/businessmen`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${BASE_URL}/en/about`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/en/pricing`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // ── Business listing pages ─────────────────────────────────────
  const { data: listings } = await supabase
    .from('listings')
    .select('slug, updated_at')
    .eq('status', 'active')
    .limit(1000)

  const listingRoutes: MetadataRoute.Sitemap = (listings ?? []).flatMap((l: any) => [
    {
      url: `${BASE_URL}/en/company/${l.slug}`,
      lastModified: new Date(l.updated_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ml/company/${l.slug}`,
      lastModified: new Date(l.updated_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ])

  // ── Event pages ────────────────────────────────────────────────
  const { data: events } = await supabase
    .from('events')
    .select('id, created_at')
    .eq('status', 'active')
    .limit(500)

  const eventRoutes: MetadataRoute.Sitemap = (events ?? []).flatMap((e: any) => [
    {
      url: `${BASE_URL}/en/events/${e.id}`,
      lastModified: new Date(e.created_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ])

  // ── Job pages ──────────────────────────────────────────────────
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, created_at')
    .eq('status', 'active')
    .limit(500)

  const jobRoutes: MetadataRoute.Sitemap = (jobs ?? []).flatMap((j: any) => [
    {
      url: `${BASE_URL}/en/jobs/${j.id}`,
      lastModified: new Date(j.created_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ])

  return [...staticRoutes, ...listingRoutes, ...eventRoutes, ...jobRoutes]
}
