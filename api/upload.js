import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ 服务密钥
const supabase = createClient(url, key);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { mode, rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ ok: false, error: 'Excel 内容为空或格式错误' });
    }

    // ✅ 如果选择了“覆盖模式”
    if (mode === 'replace') {
        const { error: delError } = await supabase.from('personal_site_data').delete().neq('id', 0);
        if (delError) return res.status(500).json({ ok: false, error: '删除旧数据失败: ' + delError.message });
    }

    const formatted = rows.map(r => ({
        content: { title: r.title || '无标题', body: r.body || '无内容' }
    }));

    const { error } = await supabase.from('personal_site_data').insert(formatted);
    if (error) return res.status(500).json({ ok: false, error: '插入数据失败: ' + error.message });

    res.status(200).json({
        ok: true,
        message: mode === 'replace' ? '✅ 已覆盖旧数据并导入新Excel内容' : '✅ 已追加Excel内容',
        count: formatted.length
    });
}
