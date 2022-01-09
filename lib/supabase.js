import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const bucket = "bills";

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFile = async (file) => {
  const id = file.name;
  const { error: e } = await supabase.storage.from(bucket).upload(id, file);
  if (e) throw error;
  const { publicURL, error } = supabase.storage.from(bucket).getPublicUrl(id);
  if (error) throw error;
  return publicURL;
};
