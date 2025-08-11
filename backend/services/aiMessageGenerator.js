// backend/services/aiMessageGenerator.js
require("dotenv").config();
const OPENAI_KEY = process.env.OPENAI_API_KEY;

let OpenAI = null;
if (OPENAI_KEY) {
  try {
    const OpenAIClient = require("openai");
    OpenAI = new OpenAIClient({ apiKey: OPENAI_KEY });
  } catch (e) {
    console.warn("OpenAI package not available or failed to init:", e.message);
    OpenAI = null;
  }
}

/**
 * Build context from the user object for prompt
 */
function buildAIContext(user) {
  const skills =
    user.skills && user.skills.length
      ? user.skills.join(", ")
      : "no recorded skills";
  const topRoadmap =
    user.roadmap && user.roadmap.length
      ? user.roadmap.find((r) => !r.completed)
      : null;

  return {
    name: user.name || "Learner",
    currentRole: user.currentRole || "Unknown",
    desiredRole: user.desiredRole || "Unknown",
    skills,
    todayTopic: topRoadmap ? topRoadmap.title : null,
    todayDescription: topRoadmap ? topRoadmap.description : null,
  };
}

/**
 * Generates a motivational + study reminder email for a user.
 * Returns: { subject, html }
 */
async function getDailyMessage(user) {
  const ctx = buildAIContext(user);

  // AI-powered generation if OpenAI is available
  if (OpenAI) {
    const prompt = `
You are a friendly learning assistant for a skill gap analysis platform.
User data:
- Name: ${ctx.name}
- Current role: ${ctx.currentRole}
- Desired role: ${ctx.desiredRole}
- Known skills: ${ctx.skills}
- Today's recommended study topic: ${ctx.todayTopic || "No specific topic"}
- Topic description: ${ctx.todayDescription || ""}

Write a short, motivating email in HTML format.
Requirements:
1. Start with "Hi [Name],"
2. Add 1-2 motivating sentences about learning progress.
3. Add a bullet list of 2-3 specific actions for the day.
4. End with a short encouraging line.
Return JSON with keys: subject, body_html.
    `;

    try {
      const resp = await OpenAI.chat.completions.create({
        model: "gpt-4o-mini", // light & cheap model
        messages: [
          {
            role: "system",
            content: "You are a helpful, encouraging email assistant.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      });

      const out = resp.choices[0].message.content.trim();

      // Try parsing JSON from the AI output
      try {
        const parsed = JSON.parse(out);
        return {
          subject: parsed.subject || `Daily learning plan for ${ctx.name}`,
          html:
            parsed.body_html ||
            `<p>${parsed.body || parsed.message || out}</p>`,
        };
      } catch {
        // Fallback if AI didn't return JSON
        const sub = `Daily learning tip: ${ctx.todayTopic || ctx.desiredRole}`;
        return {
          subject: sub,
          html: `<div>${out.replace(/\n/g, "<br/>")}</div>`,
        };
      }
    } catch (err) {
      console.error("OpenAI call failed:", err.message || err);
      // Fall through to static template
    }
  }

  // Fallback template (no AI or AI error)
  const subject = ctx.todayTopic
    ? `Today: Learn ${ctx.todayTopic}`
    : `Daily learning reminder`;
  const actions = [];
  if (ctx.todayTopic) {
    actions.push(
      `Read a short article or documentation on "${ctx.todayTopic}".`
    );
    actions.push(`Try one exercise or quiz about ${ctx.todayTopic}.`);
    actions.push(
      `Use the study chat's Concept Explainer to clarify a tricky part.`
    );
  } else {
    actions.push("Review one item from your roadmap.");
    actions.push("Practice a small coding problem.");
  }

  const html = `
  <p>Hi ${ctx.name},</p>
  <p>Quick nudge: ${
    ctx.todayTopic
      ? `focus on <strong>${ctx.todayTopic}</strong> today.`
      : "keep making small, steady progress."
  }</p>
  <ul>
    ${actions.map((a) => `<li>${a}</li>`).join("")}
  </ul>
  <p>Keep going — every step counts! 🚀</p>
  `;

  return { subject, html };
}

module.exports = { getDailyMessage };
