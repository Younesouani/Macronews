'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeNews(initialArticles: any[]) {
  const [articles, setArticles] = useState(initialArticles)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('realtime-articles')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'articles' },
        (payload) => {
          const newArticle = payload.new
          setArticles((prev) => [{ ...newArticle, isNew: true }, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { articles }
}
