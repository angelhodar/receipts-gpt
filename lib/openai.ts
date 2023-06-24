import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const createPrompt = (text: string) => `
Here is a parsed text from a restaurant receipt line by line:

${text}

I want you to give me the list of items that have been ordered in the receipt with the following output JSON format for each item:

[{ quantity: number, unit_price: number, item: string, price: string }]

The JSON object is:
`;

export async function parseReceiptRawText(text: string) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: createPrompt(text),
      temperature: 0,
      max_tokens: 1000,
    });

    return completion.data.choices[0].text;
  } catch (error: any) {
    console.error(error);
    console.log(error.response.data)
    return null;
  }

  
}
