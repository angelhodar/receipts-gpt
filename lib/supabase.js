import { createClient } from "@supabase/supabase-js";
import Compressor from "compressorjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const bucket = "bills";

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFile = async (file) => {
  const compressedFile = await new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: 500,
      quality: 0.6,
      success: resolve,
      error: reject,
    });
  });
  const id = compressedFile.name;
  const { error: e } = await supabase.storage
    .from(bucket)
    .upload(id, compressedFile);
  if (e) throw error;
  const { publicURL, error } = supabase.storage.from(bucket).getPublicUrl(id);
  if (error) throw error;
  return publicURL;
};

export const removeFile = async (file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([file.name]);
  if (e) throw error;
  return data;
}
