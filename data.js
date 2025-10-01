// /pages/api/data.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("personal-site-data")
      .select("content")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    res.status(200).json(data.content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
