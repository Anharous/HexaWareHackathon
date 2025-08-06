// test-gemini.js - Run this to test your Gemini API connection
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGeminiConnection() {
  console.log("🧪 Testing Gemini API Connection...");

  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found in environment variables");
    console.log("📝 Please add GEMINI_API_KEY to your .env file");
    return;
  }

  console.log("✅ API Key found in environment");
  console.log(
    "🔑 API Key preview:",
    process.env.GEMINI_API_KEY.substring(0, 10) + "..."
  );

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // First, let's check what models are available
    console.log("🔍 Checking available models...");
    try {
      const models = await genAI.listModels();
      console.log("📋 Available models:");
      models.forEach((model) => {
        console.log(`  - ${model.name} | ${model.displayName}`);
      });
    } catch (listError) {
      console.log("⚠️  Could not list models, trying common model names...");
    }

    // Try different model names
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
      "gemini-pro",
    ];

    let model = null;
    let workingModelName = null;

    for (const modelName of modelNames) {
      try {
        console.log(`🧪 Trying model: ${modelName}`);
        model = genAI.getGenerativeModel({ model: modelName });
        workingModelName = modelName;
        break;
      } catch (error) {
        console.log(`❌ ${modelName} not available`);
        continue;
      }
    }

    if (!model) {
      throw new Error("No working Gemini model found");
    }

    console.log(`✅ Using model: ${workingModelName}`);

    console.log("🚀 Sending test request to Gemini...");

    const testPrompt =
      "You are a helpful AI assistant. Please respond with exactly: 'Connection successful! I am ready to help.'";

    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ SUCCESS! Gemini responded:");
    console.log("📝 Response:", text);

    if (text.includes("Connection successful")) {
      console.log("🎉 Perfect! Your Gemini API is working correctly.");
    } else {
      console.log("⚠️  API is working but response format is unexpected.");
    }

    // Test with a coding question
    console.log("\n🧪 Testing with a coding question...");
    const codeTest = await model.generateContent(
      "Explain what a for loop is in JavaScript in one sentence."
    );
    const codeResponse = await codeTest.response;
    const codeText = codeResponse.text();

    console.log("💻 Code explanation response:", codeText);
    console.log("✅ All tests passed! Your AI assistants should work now.");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);

    if (error.message.includes("API_KEY")) {
      console.log("🔧 Fix: Check your GEMINI_API_KEY in the .env file");
      console.log(
        "🌐 Get your API key from: https://makersuite.google.com/app/apikey"
      );
    } else if (error.message.includes("quota")) {
      console.log(
        "🔧 Fix: You've hit the API quota limit. Wait or upgrade your plan"
      );
    } else if (error.message.includes("billing")) {
      console.log("🔧 Fix: Enable billing for your Google Cloud project");
    } else {
      console.log("🔧 Debug info:", {
        name: error.name,
        message: error.message,
        stack: error.stack?.split("\n")[0],
      });
    }
  }
}

// Run the test
testGeminiConnection().catch(console.error);
