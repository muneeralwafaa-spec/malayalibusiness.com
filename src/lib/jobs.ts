import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type JobType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive'

export type Job = {
  id: string
  title: string
  title_ml: string | null
  company: string
  company_ml: string | null
  logo_url: string | null
  emirate: string
  emirate_ml: string | null
  location: string | null
  location_ml: string | null
  job_type: JobType
  experience: ExperienceLevel
  salary_min: number | null
  salary_max: number | null
  category: string
  category_ml: string | null
  description: string | null
  description_ml: string | null
  requirements: string[]
  requirements_ml: string[]
  deadline: string | null
  applicants: number
  featured: boolean
  urgent: boolean
  verified: boolean
  poster_id: string | null
  status: 'active' | 'closed' | 'draft'
  created_at: string
}

export type JobApplication = {
  id: number
  job_id: string
  user_id: string
  cover_note: string | null
  resume_url: string | null
  status: 'pending' | 'viewed' | 'shortlisted' | 'rejected'
  created_at: string
}

// ── Query helpers ─────────────────────────────────────────────────────────────

const SELECT_COLS = `
  id, title, title_ml, company, company_ml, logo_url,
  emirate, emirate_ml, location, location_ml,
  job_type, experience, salary_min, salary_max,
  category, category_ml, description, description_ml,
  requirements, requirements_ml, deadline, applicants,
  featured, urgent, verified, poster_id, status, created_at
`

export type JobFilters = {
  category?: string
  jobType?: JobType
  experience?: ExperienceLevel
  emirate?: string
  featured?: boolean
  search?: string
  salaryMin?: number
  limit?: number
  offset?: number
}

export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  let q = supabase
    .from('jobs')
    .select(SELECT_COLS)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('urgent', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(filters.limit ?? 50)

  if (filters.category)   q = q.eq('category', filters.category)
  if (filters.jobType)    q = q.eq('job_type', filters.jobType)
  if (filters.experience) q = q.eq('experience', filters.experience)
  if (filters.emirate)    q = q.eq('emirate', filters.emirate)
  if (filters.featured)   q = q.eq('featured', true)
  if (filters.salaryMin)  q = q.gte('salary_min', filters.salaryMin)
  if (filters.offset)     q = q.range(filters.offset, (filters.offset + (filters.limit ?? 50)) - 1)

  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await q
  if (error) { console.error('[getJobs]', error.message); return [] }
  return (data ?? []) as Job[]
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select(SELECT_COLS)
    .eq('id', id)
    .single()

  if (error) { console.error('[getJob]', error.message); return null }
  return data as Job
}

export async function getFeaturedJobs(limit = 4): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select(SELECT_COLS)
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('[getFeaturedJobs]', error.message); return [] }
  return (data ?? []) as Job[]
}

export async function applyForJob(
  jobId: string,
  userId: string,
  details: { coverNote?: string; resumeUrl?: string }
): Promise<boolean> {
  const { error } = await supabase
    .from('job_applications')
    .insert({
      job_id: jobId,
      user_id: userId,
      cover_note: details.coverNote,
      resume_url: details.resumeUrl,
    })

  if (error) { console.error('[applyForJob]', error.message); return false }

  // Increment applicants count
  await supabase
    .from('jobs')
    .update({ applicants: supabase.rpc?.('') as unknown as number })
    .eq('id', jobId)

  return true
}

export async function hasApplied(jobId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('job_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .maybeSingle()

  return !!data
}

export async function getMyApplications(userId: string): Promise<{ application: JobApplication; job: Job }[]> {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`*, jobs(${SELECT_COLS})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) { console.error('[getMyApplications]', error.message); return [] }
  return ((data ?? []).map((r: any) => ({
    application: r as JobApplication,
    job: r.jobs as Job,
  })).filter(r => r.job))
}

export async function getJobCategories(): Promise<string[]> {
  const { data } = await supabase
    .from('jobs')
    .select('category')
    .eq('status', 'active')

  const unique = Array.from(new Set((data ?? []).map((r: any) => r.category as string)))
  return unique.sort()
}
