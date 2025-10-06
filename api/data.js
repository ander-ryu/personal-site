// ✅ /pages/api/data.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return res.status(500).json({
      ok: false,
      message: '❌ 环境变量未加载',
      url: url || 'undefined',
      key: key ? '存在' : 'undefined',
    })
  }

  const supabase = createClient(url, key)

  const { data, error } = await supabase
    .from('personal-site-data')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)

  if (error) return res.status(400).json({ ok: false, error: error.message })

  if (!data || !data.length)
    return res.status(200).json({ title: '无标题', body: '无内容' })

  let content = data[0].content
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content)
    } catch {}
  }

  res.status(200).json({
    title: '数据库内容',
    body: content?.body || '无内容',
  })
}
