import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type CommunityPost = {
  id: string
  slug: string
  title: string
  title_ml: string | null
  excerpt: string | null
  excerpt_ml: string | null
  body: string | null
  body_ml: string | null
  category: string
  category_ml: string | null
  author_name: string
  author_name_ml: string | null
  author_avatar: string | null
  author_role: string | null
  author_role_ml: string | null
  image_url: string | null
  read_time: number
  views: number
  likes: number
  comments_count: number
  featured: boolean
  trending: boolean
  tags: string[]
  author_id: string | null
  status: 'published' | 'draft' | 'archived'
  published_at: string
  created_at: string
}

export type CommunityComment = {
  id: number
  post_id: string
  user_id: string | null
  author_name: string
  author_avatar: string | null
  body: string
  likes: number
  created_at: string
}

// ── Query helpers ─────────────────────────────────────────────────────────────

const POST_COLS = `
  id, slug, title, title_ml, excerpt, excerpt_ml, body, body_ml,
  category, category_ml, author_name, author_name_ml, author_avatar,
  author_role, author_role_ml, image_url, read_time, views, likes,
  comments_count, featured, trending, tags, author_id,
  status, published_at, created_at
`

export type PostFilters = {
  category?: string
  featured?: boolean
  trending?: boolean
  search?: string
  limit?: number
  offset?: number
}

export async function getPosts(filters: PostFilters = {}): Promise<CommunityPost[]> {
  let q = supabase
    .from('community_posts')
    .select(POST_COLS)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(filters.limit ?? 20)

  if (filters.category) q = q.eq('category', filters.category)
  if (filters.featured) q = q.eq('featured', true)
  if (filters.trending) q = q.eq('trending', true)
  if (filters.offset)   q = q.range(filters.offset, (filters.offset + (filters.limit ?? 20)) - 1)

  if (filters.search) {
    q = q.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
  }

  const { data, error } = await q
  if (error) { console.error('[getPosts]', error.message); return [] }
  return (data ?? []) as CommunityPost[]
}

export async function getPost(slug: string): Promise<CommunityPost | null> {
  const { data, error } = await supabase
    .from('community_posts')
    .select(POST_COLS)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) { console.error('[getPost]', error.message); return null }
  return data as CommunityPost
}

export async function getFeaturedPosts(limit = 3): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select(POST_COLS)
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('[getFeaturedPosts]', error.message); return [] }
  return (data ?? []) as CommunityPost[]
}

export async function getTrendingPosts(limit = 5): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select(POST_COLS)
    .eq('status', 'published')
    .eq('trending', true)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) { console.error('[getTrendingPosts]', error.message); return [] }
  return (data ?? []) as CommunityPost[]
}

export async function getPostComments(postId: string): Promise<CommunityComment[]> {
  const { data, error } = await supabase
    .from('community_comments')
    .select('id, post_id, user_id, author_name, author_avatar, body, likes, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) { console.error('[getPostComments]', error.message); return [] }
  return (data ?? []) as CommunityComment[]
}

export async function addComment(
  postId: string,
  userId: string | null,
  authorName: string,
  authorAvatar: string | null,
  body: string
): Promise<CommunityComment | null> {
  const { data, error } = await supabase
    .from('community_comments')
    .insert({ post_id: postId, user_id: userId, author_name: authorName, author_avatar: authorAvatar, body })
    .select()
    .single()

  if (error) { console.error('[addComment]', error.message); return null }
  return data as CommunityComment
}

export async function incrementPostViews(postId: string): Promise<void> {
  // Use a simple update; a proper RPC would be ideal for atomicity
  const { data } = await supabase
    .from('community_posts')
    .select('views')
    .eq('id', postId)
    .single()

  if (data) {
    await supabase
      .from('community_posts')
      .update({ views: (data.views ?? 0) + 1 })
      .eq('id', postId)
  }
}

export async function likePost(postId: string): Promise<void> {
  const { data } = await supabase
    .from('community_posts')
    .select('likes')
    .eq('id', postId)
    .single()

  if (data) {
    await supabase
      .from('community_posts')
      .update({ likes: (data.likes ?? 0) + 1 })
      .eq('id', postId)
  }
}

export async function getPostCategories(): Promise<string[]> {
  const { data } = await supabase
    .from('community_posts')
    .select('category')
    .eq('status', 'published')

  const unique = Array.from(new Set((data ?? []).map((r: any) => r.category as string)))
  return unique.sort()
}
