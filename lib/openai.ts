import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parametersToParse = {
  type: "object",
  required: ["items", "total"],
  properties: {
    total: {
      type: "number",
      description: "The total price of the receipt",
    },
    items: {
      type: "array",
      description: "The array of parsed items",
      items: {
        type: "object",
        required: ["quantity", "unit_price", "name", "price"],
        properties: {
          quantity: {
            type: "number",
            description: "The quantity of an item",
          },
          unit_price: {
            type: "number",
            description: "The unit price of the item",
          },
          name: {
            type: "string",
            description: "The name of the item",
          },
          price: {
            type: "number",
            description: "The total price of the item row",
          },
        },
      },
    },
  },
}

const createPrompt = () => `
Give me the list of items that have been ordered in the receipt, including the total amount, with the following output JSON format:

{ total: number, items: [{ "quantity": number, "unit_price": number, "name": string, "price": number }]}

If you cant parse price or unit_price as number, leave it as 0

The JSON object is:
`;

export async function parseReceipt(receiptUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: createPrompt() },
            { type: "image_url", image_url: { url: receiptUrl } }
          ]
        }],
      temperature: 0,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      /*tools: [
        {
          type: "function", function: {
            name: "print",
            description: "Prints the parsed receipt",
            parameters: parametersToParse
          },
        }
      ],
      tool_choice: {
        type: "function", function: { name: "print" }
      }*/
    })

    const output = response.choices[0].message.content//?.function_call?.arguments as string

    if (!output) return null

    const { total, items } = JSON.parse(output);
    return { total, items };
  } catch (error: any) {
    console.error(error);
    return null;
  }
}
