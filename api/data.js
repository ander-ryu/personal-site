import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("personal-site-data")
      .select("content")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(200).json({ message: "no data" });
    }

    // 返回第一条数据
    res.status(200).json(data[0].content);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
