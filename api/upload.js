// api/upload.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,        // ✅ 用你现有的 URL 变量
    process.env.SUPABASE_SERVICE_ROLE_KEY        // ✅ 用服务端专用的 service_role key
);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // 二次校验（Authorization 里带密码）
    const auth = (req.headers.authorization || "").replace("Bearer ", "").trim();
    const correct = process.env.ADMIN_TOKEN || "";
    if (!auth || auth !== correct) {
        return res.status(403).json({ ok: false, error: "Unauthorized" });
    }

    const { mode, rows } = req.body || {};
    if (!Array.isArray(rows)) {
        return res.status(400).json({ ok: false, error: "Invalid rows" });
    }

    try {
        if (mode === "overwrite") {
            await supabase.from("personal_site_data").delete().neq("id", 0);
        }

        // 先获取已有数据的 title 列
        const { data: existing } = await supabase
            .from("personal_site_data")
            .select("content->>title");

        const existingTitles = new Set(existing?.map(e => e.title) || []);

        const toInsert = rows
            .filter(r => !existingTitles.has(r.title)) // ✅ 去重逻辑
            .map(r => ({
                content: { title: r.title ?? "", body: r.body ?? "" },
                created_at: new Date().toISOString(),
            }));

        if (toInsert.length === 0) {
            return res.json({ ok: true, message: "无新数据", count: 0 });
        }

        const { error } = await supabase.from("personal_site_data").insert(toInsert);
        if (error) throw error;

        res.json({ ok: true, count: toInsert.length });
    } catch (e) {
        res.status(500).json({ ok: false, error: String(e.message || e) });
    }
}