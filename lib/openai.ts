import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parametersToParse = {
  type: "object",
  required: ["items"],
  properties: {
    items: {
      type: "array",
      description: "The array of parsed items",
      items: {
        type: "object",
        required: ["quantity", "name", "price"],
        properties: {
          quantity: {
            type: "number",
            description: "The quantity of an item",
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
Give me the list of items that have been ordered in the receipt, with the following output JSON format:

[{ "quantity": number, "name": string, "price": number }]

If you cant parse price as number, leave it as 0

The JSON object is:
`;

export async function parseReceipt(receiptUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
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
      /*
      1. Not available at the moment so we need to parse using regex
      response_format: { type: "json_object" }, 
      2. Function calls also not available
      tools: [
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

    const output = response.choices[0].message.content

    if (!output) return null

    const match = output?.match(/```json\n(.*?)\n```/s);

    if (!match) return null

    const json = match[1];
    const data = JSON.parse(json);

    return { items: data }
  } catch (error: any) {
    console.error(error);
    return null;
  }
}
