// api/upload.js
import { createClient } from "@supabase/supabase-js";

// ✅ 初始化 Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // ✅ 二次验证后台密码
    const auth = (req.headers.authorization || "").replace("Bearer ", "").trim();
    const correct = process.env.ADMIN_TOKEN || "";
    if (!auth || auth !== correct) {
        return res.status(403).json({ ok: false, error: "Unauthorized" });
    }

    // ✅ 解析请求体
    const { table, mode, rows } = req.body || {};
    if (!table || !Array.isArray(rows)) {
        return res.status(400).json({ ok: false, error: "Invalid request body" });
    }

    try {
        // ✅ 1️⃣ 覆盖模式：先清空表
        if (mode === "overwrite") {
            await supabase.from(table).delete().neq("id", 0);
        }

        // ✅ 2️⃣ 获取现有数据（根据表结构不同区分）
        let existingKeys = new Set();

        if (mode === "append") {
            // 不同表使用不同字段作为“唯一标识”
            let keyField = null;

            if (table === "resume_data") keyField = "experience";
            else if (table === "project_data") keyField = "title";
            else if (table === "hobby_data") keyField = "hobby";
            else if (table === "contact_data") keyField = "email";
            else if (table === "news_data") keyField = "title";
            else keyField = null;

            if (keyField) {
                const { data: existing } = await supabase.from(table).select(keyField);
                existingKeys = new Set(existing?.map(e => e[keyField]) || []);
            }
        }

        // ✅ 3️⃣ 去重处理
        const toInsert = rows.filter(r => {
            const key = r.title || r.experience || r.hobby || r.email || "";
            return !existingKeys.has(key);
        });

        if (toInsert.length === 0) {
            return res.json({ ok: true, message: "无新数据", count: 0 });
        }

        // ✅ 4️⃣ 插入数据
        const { error } = await supabase.from(table).insert(toInsert);
        if (error) throw error;

        res.json({ ok: true, count: toInsert.length });
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, error: e.message || String(e) });
    }
}
