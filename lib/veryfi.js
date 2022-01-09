import Client from "@veryfi/veryfi-sdk";

const veryfi = new Client(
  process.env.VERYFI_CLIENT_ID,
  process.env.VERYFI_CLIENT_SECRET,
  process.env.VERYFI_USERNAME,
  process.env.VERYFI_API_KEY
);

export const processBill = async (url) => {
  const { id, line_items, total } = await veryfi.process_document_url(url, [
    "Meals & Entertainment",
  ]);
  const items = line_items.map(({ description, quantity, total }) => ({
    item: description,
    price: total,
    quantity,
  }));
  return { veryfi: id, total, items, url};
};
