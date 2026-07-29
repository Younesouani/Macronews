import { createClient } from '@supabase/supabase-js'
import NewsFeed from '@/components/news/NewsFeed'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let articles = []

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mujxnzazkqqxpjbftvtb.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      if (!error && data) {
        articles = data
      }
    }
  } catch (err) {
    console.error('Failed to fetch articles:', err)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="border-b border-zinc-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            MACRO<span className="text-emerald-500">NEWS</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Institutional-grade macro catalyst feed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-400 uppercase">Live Wire</span>
        </div>
      </header>

      <NewsFeed initialArticles={articles} />
    </main>
  )
}
