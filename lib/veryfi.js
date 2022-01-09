import Client from "@veryfi/veryfi-sdk";

const veryfi = new Client(
  process.env.VERYFI_CLIENT_ID,
  process.env.VERYFI_CLIENT_SECRET,
  process.env.VERYFI_USERNAME,
  process.env.VERYFI_API_KEY
);

const formatOrder = ({ id, line_items, total }) => {
  // Get the total price summing the items price
  const sum = line_items
    .map((item) => item.price)
    .reduce((prev, curr) => prev + curr, 0);
  // If that sum is equal to total it means the price of each item is multiplied by quantity
  const quantityAppliedPerItem = sum === total;
  const items = line_items.map(({ description, quantity, price }) => ({
    item: description,
    price: quantityAppliedPerItem ? price : quantity * price,
    quantity,
  }));
  return { veryfi: id, total, items };
};

export const processBill = async (url) => {
  const data = veryfi.process_document_url(url, null, [
    "Meals & Entertainment",
  ]);
  return { url, ...formatOrder(data) };
};

/*const saveFile = async (req) => {
  const form = new formidable.IncomingForm();
  const data = await new Promise(function (resolve, reject) {
    form.parse(req, async function (err, fields, files) {
      const { data, error } = await supabase.storage
        .from("bills")
        .upload("test.png", files.file);
      if (error) reject(error);
      else resolve(data);
    });
  });
  return data;
};*/
