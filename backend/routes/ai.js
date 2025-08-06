const express = require("express");
const router = express.Router();
const aiService = require("../services/aiService");

// POST /api/ai/chat - Send message to AI assistant
router.post("/chat", async (req, res) => {
  try {
    const { message, aiType, conversationHistory } = req.body;

    console.log(
      `[AI Route] Received request for ${aiType}: ${message?.substring(
        0,
        100
      )}...`
    );

    // Validation
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      console.log("[AI Route] Invalid message provided");
      return res.status(400).json({
        success: false,
        error: "Valid message is required",
      });
    }

    if (!aiType || typeof aiType !== "string") {
      console.log("[AI Route] Invalid AI type provided");
      return res.status(400).json({
        success: false,
        error: "AI type is required",
      });
    }

    // Validate aiType
    const validAITypes = [
      "code-reviewer",
      "interview-coach",
      "concept-explainer",
      "documentation-helper",
      "debugging-assistant",
      "ui-ux-advisor",
    ];

    if (!validAITypes.includes(aiType)) {
      console.log(`[AI Route] Invalid AI type: ${aiType}`);
      return res.status(400).json({
        success: false,
        error: "Invalid AI type. Valid types: " + validAITypes.join(", "),
      });
    }

    // Validate conversation history
    const validHistory = Array.isArray(conversationHistory)
      ? conversationHistory
      : [];

    // Filter and validate history messages
    const cleanHistory = validHistory
      .filter(
        (msg) => msg && typeof msg === "object" && msg.content && msg.type
      )
      .map((msg) => ({
        type: msg.type,
        content: String(msg.content).trim(),
        timestamp: msg.timestamp || new Date(),
      }))
      .slice(-10); // Keep only last 10 messages

    console.log(
      `[AI Route] Processing with ${cleanHistory.length} history messages`
    );

    // Generate AI response
    const response = await aiService.generateResponse(
      message.trim(),
      aiType,
      cleanHistory
    );

    if (!response) {
      throw new Error("Empty response from AI service");
    }

    console.log(`[AI Route] Successfully generated response for ${aiType}`);

    res.json({
      success: true,
      response: response,
      aiType: aiType,
      timestamp: new Date().toISOString(),
      messageCount: cleanHistory.length + 1,
    });
  } catch (error) {
    console.error("[AI Route] Error:", error);

    // Determine error type and provide appropriate response
    let statusCode = 500;
    let errorMessage = "Failed to generate AI response";
    let userMessage =
      "I'm experiencing technical difficulties. Please try again.";

    if (error.message?.includes("API_KEY")) {
      statusCode = 503;
      errorMessage = "AI service configuration error";
      userMessage =
        "AI service is temporarily unavailable due to configuration issues.";
    } else if (
      error.message?.includes("quota") ||
      error.message?.includes("limit")
    ) {
      statusCode = 429;
      errorMessage = "Rate limit exceeded";
      userMessage =
        "AI service is experiencing high demand. Please try again in a moment.";
    } else if (
      error.message?.includes("network") ||
      error.message?.includes("timeout")
    ) {
      statusCode = 503;
      errorMessage = "Network connectivity issue";
      userMessage =
        "Having trouble connecting to AI service. Please check your connection and try again.";
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      message: userMessage,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/ai/types - Get available AI assistant types
router.get("/types", (req, res) => {
  try {
    const aiTypes = [
      {
        id: "code-reviewer",
        name: "Code Reviewer",
        description: "Reviews your code, finds bugs, and suggests improvements",
        icon: "Code",
        color: "bg-green-500",
        status: "active",
      },
      {
        id: "interview-coach",
        name: "Interview Coach",
        description: "Helps you prepare for technical interviews",
        icon: "MessageCircle",
        color: "bg-blue-500",
        status: "active",
      },
      {
        id: "concept-explainer",
        name: "Concept Explainer",
        description: "Explains complex programming concepts in simple terms",
        icon: "Brain",
        color: "bg-purple-500",
        status: "active",
      },
      {
        id: "documentation-helper",
        name: "Doc Helper",
        description: "Helps create documentation and README files",
        icon: "FileText",
        color: "bg-orange-500",
        status: "active",
      },
      {
        id: "debugging-assistant",
        name: "Debug Detective",
        description: "Helps troubleshoot and debug code issues",
        icon: "Bot",
        color: "bg-red-500",
        status: "active",
      },
      {
        id: "ui-ux-advisor",
        name: "UI/UX Advisor",
        description:
          "Provides feedback on user interface and experience design",
        icon: "Video",
        color: "bg-pink-500",
        status: "active",
      },
    ];

    res.json({
      success: true,
      aiTypes: aiTypes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Route] Error fetching AI types:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch AI types",
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/ai/health - Check AI service health
router.get("/health", async (req, res) => {
  try {
    const isHealthy = await aiService.testConnection();

    res.json({
      success: true,
      healthy: isHealthy,
      status: isHealthy ? "operational" : "degraded",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Route] Health check failed:", error);
    res.status(503).json({
      success: false,
      healthy: false,
      status: "offline",
      error: "Health check failed",
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
