// ✅ /pages/display.js
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function DisplayPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('personal-site-data')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('❌ 数据加载失败:', error)
      } else {
        console.log('✅ 数据加载成功:', data)
        setRecords(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <p>加载中...</p>

  if (!records.length) return <p>没有数据</p>

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>网站内容</h1>
      {records.map((item) => (
        <div key={item.id} style={{ marginBottom: '20px' }}>
          <h3>记录 #{item.id}</h3>
          <p>
            <b>创建时间：</b> {new Date(item.created_at).toLocaleString()}
          </p>
          <p>
            <b>正文内容：</b>{' '}
            {typeof item.content === 'string'
              ? item.content
              : item.content?.body || '无内容'}
          </p>
        </div>
      ))}
    </div>
  )
}
