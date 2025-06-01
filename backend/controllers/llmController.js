import { InferenceClient } from "@huggingface/inference";
import Customer from "../models/Customer.js";

const client = new InferenceClient("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");

const extractQuery = (response) => {
  const match = response.match(/Customer\.find\((\{.*\})\)/s);
  return match ? `Customer.find(${match[1]})` : null;
};

// Generate and execute a query from the LLM
export const queryCustomers = async (req, res) => {
  const { query } = req.body;

  try {
    // Provide schema and example context to the LLM
    const systemMessage = `
You are assisting in generating MongoDB Mongoose queries. 
Here is the customer schema:
{
  name: String,
  email: String,
  phone: String,
  spend: Number,
  visits: Number,
  lastActiveDate: Date
}

Examples of MongoDB queries:
1. Find customers who spent more than 1000:
   Customer.find({ spend: { $gt: 1000 } });
2. Find customers with less than 5 visits:
   Customer.find({ visits: { $lt: 5 } });
3. Find customers inactive for more than 90 days:
   Customer.find({ lastActiveDate: { $lt: new Date(Date.now() - 90*24*60*60*1000) } });

Your task is to generate only the Mongoose query for the following user input: "${query}"
`;

    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "deepseek-ai/DeepSeek-R1-0528",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: query },
      ],
    });

    const fullResponse = chatCompletion.choices[0].message.content.trim();
    const mongooseQuery = extractQuery(fullResponse).split(";")[0];
    console.log(mongooseQuery);

    if (!mongooseQuery) {
      return res
        .status(400)
        .json({ error: "Failed to generate a valid Mongoose query." });
    }

    // Execute the Mongoose query securely
    const results = await eval(mongooseQuery); // Replace with a parser for production safety
    res.json({ customers: results, total: results.length });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Error processing query" });
  }
};
