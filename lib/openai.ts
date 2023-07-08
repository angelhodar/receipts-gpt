import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createPrompt = (text: string) => `
Here is a parsed text from a restaurant receipt line by line:

${text}

I want you to give me the list of items that have been ordered in the receipt with the following output JSON format for each item:

[{ "quantity": number, "unit_price": number, "name": string, "price": number }]

Note: If you cant parse price or unit_price as number, leave it as 0

The JSON object is:
`;

export async function parseReceiptRawText(text: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: createPrompt(text) }],
      functions: [
        {
          name: "print",
          description: "Prints the parsed receipt",
          parameters: {
            type: "object",
            required: ["items"],
            properties: {
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
          },
        },
      ],
      temperature: 0,
      max_tokens: 2000,
    });

    const { data } = response;
    const { items } = JSON.parse(
      data.choices[0].message?.function_call?.arguments as string
    );
    return items;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}
