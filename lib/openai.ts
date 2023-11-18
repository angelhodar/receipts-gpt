import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createPrompt = () => `
Give me the list of items that have been ordered in the receipt, with the following output JSON format:

[{ "quantity": number, "name": string, "price": number }]

If you cant parse price as number, leave it as 0. Dont include any comments in the JSON output, make sure its parseable

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
    })

    const output = response.choices[0].message.content

    if (process.env.NODE_ENV !== "production") console.log(output)

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
