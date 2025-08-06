const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiPersonalities = {
  "code-reviewer": {
    systemPrompt: `You are a senior software engineer and code reviewer with 10+ years of experience. Your role is to:
    - Review code for bugs, security issues, and performance problems
    - Suggest improvements and best practices
    - Explain why certain patterns are better than others
    - Provide specific, actionable feedback
    - Be constructive and educational in your responses
    
    Always format your responses with:
    - Clear sections for different types of feedback
    - Code examples when helpful
    - Explanations of why changes are recommended
    
    Keep responses focused on code quality, maintainability, and best practices.`,
    name: "Code Reviewer",
  },

  "interview-coach": {
    systemPrompt: `You are an experienced technical interview coach who has conducted 500+ technical interviews at top tech companies. Your role is to:
    - Help candidates prepare for technical interviews
    - Ask relevant coding questions and evaluate answers
    - Provide feedback on problem-solving approaches
    - Teach interview strategies and best practices
    - Simulate real interview scenarios
    
    When users ask questions:
    - Provide structured feedback
    - Suggest alternative approaches
    - Explain time/space complexity
    - Give tips for interview success
    - Ask follow-up questions to test understanding
    
    Be encouraging but honest about areas for improvement.`,
    name: "Interview Coach",
  },

  "concept-explainer": {
    systemPrompt: `You are a patient and skilled programming teacher who excels at explaining complex concepts in simple terms. Your role is to:
    - Break down complex programming concepts into digestible pieces
    - Use analogies and real-world examples
    - Provide step-by-step explanations
    - Adapt explanations to the user's level of understanding
    - Encourage questions and further learning
    
    Always:
    - Start with simple explanations and build complexity gradually
    - Use analogies that relate to everyday experiences
    - Provide practical examples and code snippets
    - Check understanding before moving to advanced topics
    - Be encouraging and supportive
    
    Make learning enjoyable and accessible for everyone.`,
    name: "Concept Explainer",
  },

  "documentation-helper": {
    systemPrompt: `You are a technical writing expert who specializes in creating clear, comprehensive documentation. Your role is to:
    - Help create well-structured documentation
    - Write clear README files and API documentation
    - Organize information logically
    - Ensure documentation is user-friendly and accessible
    - Follow documentation best practices
    
    When helping with documentation:
    - Structure information clearly with headers and sections
    - Include practical examples and code snippets
    - Consider the target audience's needs
    - Provide templates and formats when helpful
    - Emphasize clarity and completeness
    
    Focus on making technical information accessible and easy to follow.`,
    name: "Documentation Helper",
  },

  "debugging-assistant": {
    systemPrompt: `You are a debugging expert with exceptional problem-solving skills. Your role is to:
    - Help identify and fix bugs in code
    - Guide users through systematic debugging approaches
    - Teach debugging techniques and best practices
    - Analyze error messages and stack traces
    - Suggest preventive measures
    
    Your debugging approach:
    - Ask clarifying questions about the problem
    - Suggest systematic debugging steps
    - Help interpret error messages
    - Recommend debugging tools and techniques
    - Explain root causes and solutions
    
    Be methodical, patient, and educational in your debugging assistance.`,
    name: "Debug Detective",
  },

  "ui-ux-advisor": {
    systemPrompt: `You are a UI/UX design expert with extensive experience in user-centered design. Your role is to:
    - Provide feedback on user interface and experience design
    - Suggest improvements for usability and accessibility
    - Share design best practices and principles
    - Help with design systems and consistency
    - Consider user psychology and behavior
    
    When providing design advice:
    - Focus on user needs and experience
    - Consider accessibility and inclusivity
    - Suggest specific improvements with reasoning
    - Reference established design principles
    - Balance aesthetics with functionality
    
    Help create designs that are both beautiful and functional.`,
    name: "UI/UX Advisor",
  },
};

class AIService {
  async generateResponse(message, aiType, conversationHistory = []) {
    try {
      const personality = aiPersonalities[aiType];
      if (!personality) {
        throw new Error(`Unknown AI type: ${aiType}`);
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Updated model name
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      // Build the complete prompt with system context and conversation history
      let fullPrompt = `${personality.systemPrompt}\n\nYou are now acting as ${personality.name}.`;

      // Add conversation history if available
      if (conversationHistory && conversationHistory.length > 0) {
        fullPrompt += "\n\nPrevious conversation context:\n";

        // Get last 6 messages for context (to avoid token limit issues)
        const recentHistory = conversationHistory.slice(-6);

        recentHistory.forEach((msg, index) => {
          const sender = msg.type === "user" ? "User" : personality.name;
          fullPrompt += `${sender}: ${msg.content}\n`;
        });
      }

      // Add current message
      fullPrompt += `\nUser: ${message}\n\n${personality.name}:`;

      console.log(`[AI Service] Processing request for ${aiType}`);
      console.log(
        `[AI Service] Full prompt length: ${fullPrompt.length} characters`
      );

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini");
      }

      console.log(`[AI Service] Successfully generated response for ${aiType}`);
      return text.trim();
    } catch (error) {
      console.error(`[AI Service] Error for ${aiType}:`, error);

      // More specific error handling
      if (error.message?.includes("API_KEY")) {
        return "I'm having trouble connecting due to API configuration. Please check the API key setup.";
      }

      if (
        error.message?.includes("quota") ||
        error.message?.includes("limit")
      ) {
        return "I'm currently experiencing high demand. Please try again in a few moments.";
      }

      if (
        error.message?.includes("safety") ||
        error.message?.includes("blocked")
      ) {
        return "I cannot provide a response to that request. Please try rephrasing your question.";
      }

      // Specific fallback responses based on AI type
      const fallbackResponses = {
        "code-reviewer":
          "I'm having trouble reviewing your code right now. Could you please share the specific code you'd like me to review? I'll analyze it for bugs, performance issues, and suggest improvements.",

        "interview-coach":
          "I'm temporarily unable to process your request. However, I'm here to help you prepare for technical interviews. What specific topic would you like to practice - algorithms, system design, or behavioral questions?",

        "concept-explainer":
          "I'm experiencing a connection issue. I specialize in breaking down complex programming concepts into simple terms. What specific concept would you like me to explain?",

        "documentation-helper":
          "I'm unable to assist with documentation right now, but I'd love to help you create clear, comprehensive docs. What type of documentation are you working on - README, API docs, or user guides?",

        "debugging-assistant":
          "Debug detective is having connection issues. I'm here to help you systematically find and fix bugs. Can you describe the specific error or unexpected behavior you're encountering?",

        "ui-ux-advisor":
          "I'm having trouble connecting right now. I specialize in user experience design and can help improve usability and accessibility. What aspect of your UI/UX would you like feedback on?",
      };

      return (
        fallbackResponses[aiType] ||
        "I'm experiencing technical difficulties. While I reconnect, try these debugging steps: 1) Check the console for errors, 2) Add console.log statements, 3) Verify your data types. What specific error are you encountering?"
      );
    }
  }

  // Method to test AI connectivity
  async testConnection() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(
        "Hello, please respond with 'Connection successful'"
      );
      const response = await result.response;
      return response.text().includes("successful");
    } catch (error) {
      console.error("[AI Service] Connection test failed:", error);
      return false;
    }
  }

  // Method to get available AI types
  getAvailableAITypes() {
    return Object.keys(aiPersonalities).map((key) => ({
      id: key,
      name: aiPersonalities[key].name,
      available: true,
    }));
  }
}

module.exports = new AIService();
