import { Configuration, OpenAIApi } from "openai-edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createPrompt = (text: string) => `
I am going to give you the AWS Textract raw document text response for a receipt.
I want you to parse the text and give me the list of items that have been ordered in the receipt with the following output JSON format:

[
    {
        quantity: number
        unit_price: number
        item: string
        price: string
    }
]

ONLY return the output JSON format, nothing else. Here you have the raw receipt text:

${text}

The JSON object is:
`;

export async function parseReceiptRawText(text: string) {
  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: createPrompt(text),
      temperature: 0,
      max_tokens: 1000,
    });

    return new Response(completion.body);
  } catch (error: any) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
