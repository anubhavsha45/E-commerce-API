const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("./../models/Product");
const catchAsync = require("./../utils/catchAsync");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.aiAssistant = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Convert this shopping query into MongoDB filter JSON.

Rules:
- Only return valid JSON
- Use fields: category, price
- price should use $lt, $gt if needed

Query: "${query}"
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  let filters;
  try {
    filters = JSON.parse(response);
  } catch (err) {
    filters = {};
  }
  const products = await Product.find(filters);

  res.status(200).json({
    status: "success",
    filtersUsed: filters,
    results: products.length,
    data: products,
  });
});
