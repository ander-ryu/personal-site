// ✅ /pages/api/testConnection.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 1️⃣ 从环境变量读取 Supabase 的连接信息
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // 2️⃣ 访问数据库（表名与 Supabase 控制台一致）
  const { data, error } = await supabase
    .from('personal-site-data') // ⚠️ 这里的表名要完全一致
    .select('*')
    .limit(2)

  // 3️⃣ 输出结果
  if (error) {
    return res.status(400).json({
      ok: false,
      message: '❌ Supabase connection failed',
      error,
    })
  }

  return res.status(200).json({
    ok: true,
    message: '✅ Supabase connection successful',
    count: data.length,
    data,
  })
}

