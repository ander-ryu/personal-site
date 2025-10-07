import { createClient } from '@supabase/supabase-js';
import { parseISO } from 'date-fns';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
    // ✅ 后端安全验证
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const correctToken = process.env.ADMIN_TOKEN; // 从环境变量读取

    if (token !== correctToken) {
        return res.status(403).json({ ok: false, error: "无权访问：Token错误" });
    }

    const { mode, rows } = req.body;
    if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({ ok: false, error: "无效数据" });
    }

    try {
        if (mode === "overwrite") {
            await supabase.from("personal_site_data").delete().neq("id", 0);
        }

        const toInsert = rows.map(r => ({
            content: { title: r.title, body: r.body },
            created_at: new Date().toISOString()
        }));

        const { error } = await supabase.from("personal_site_data").insert(toInsert);
        if (error) throw error;

        res.json({ ok: true, count: rows.length });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
}
