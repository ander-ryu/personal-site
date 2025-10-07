export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ ok: false });
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ ok: false });

    const correct = process.env.ADMIN_TOKEN; // ⚠️ Vercel 环境变量
    if (password === correct) {
        return res.json({ ok: true });
    } else {
        return res.status(403).json({ ok: false });
    }
}
