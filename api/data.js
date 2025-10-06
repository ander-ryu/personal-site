// ✅ /pages/api/data.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("🧩 Supabase URL =", url)
  console.log("🧩 Supabase Key =", key ? "存在" : "不存在")

  if (!url || !key) {
    return res.status(500).json({
      ok: false,
      message: '❌ 环境变量未加载',
      url: url || 'undefined',
      key: key ? '存在' : 'undefined'
    })
  }

  const supabase = createClient(url, key)

  const { data, error } = await supabase
    .from('"personal-site-data"')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Supabase 查询错误：', error)
    return res.status(400).json({ ok: false, error: error.message })
  }

  res.status(200).json({
    ok: true,
    message: '✅ 成功连接 Supabase',
    data
  })
}
