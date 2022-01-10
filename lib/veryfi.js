import Client from "@veryfi/veryfi-sdk";

const veryfi = new Client(
  process.env.VERYFI_CLIENT_ID,
  process.env.VERYFI_CLIENT_SECRET,
  process.env.VERYFI_USERNAME,
  process.env.VERYFI_API_KEY
);

export const processBill = async (url) => {
  const data = await veryfi.process_document_url(url, [
    "Meals & Entertainment",
  ]);
  const { id, line_items, document_type, total } = data;
  if (document_type === "") return null; // Ticket image is not valid
  const items = line_items.map(({ description, quantity, total: price }) => ({
    item: description,
    price,
    quantity: Math.ceil(quantity),
  }));
  return { veryfi: id, total, items, url };
};
