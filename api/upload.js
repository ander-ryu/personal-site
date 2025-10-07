import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // ⚠️ 一定要用服务密钥（service role key）
const supabase = createClient(url, key);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const rows = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ ok: false, error: 'Excel 内容为空或格式错误' });
    }

    const formatted = rows.map(r => ({
        content: { title: r.title || '无标题', body: r.body || '无内容' }
    }));

    const { error } = await supabase.from('personal_site_data').insert(formatted);

    if (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: error.message });
    }

    res.status(200).json({ ok: true, message: '成功导入 Excel 数据', count: formatted.length });
}
