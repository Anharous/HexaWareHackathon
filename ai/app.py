
from flask import Flask, render_template_string, request, session, jsonify
from datetime import timedelta
import google.generativeai as genai

gemini_api_key = "AIzaSyC1qPts9X8D5Dz1IfltMa4l2aI2cS_94qg"
genai.configure(api_key=gemini_api_key)

app = Flask(__name__)
app.secret_key = "super-secret-key"
app.permanent_session_lifetime = timedelta(minutes=30)

def get_chatbot_response(user_input):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(user_input)
        formatted = response.text.replace("\n", "<br>").replace("**", "")
        return formatted
    except Exception as e:
        return f"<span style='color: red;'>An error occurred: {e}</span>"

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>AmiBot ✨</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #1e1e3f;
            color: #fff;
            margin: 0;
        }

        .chatbot-header {
            background: #7c4dff;
            padding: 1rem;
            text-align: center;
            font-weight: bold;
            color: white;
        }

        .chatbot-body {
            padding: 1rem;
            height: 450px;
            overflow-y: auto;
        }

        .chatbot-form {
            display: flex;
            gap: 0.5rem;
            padding: 1rem;
            background: #2a2a48;
        }

        .chatbot-form input {
            flex: 1;
            padding: 0.5rem;
            border-radius: 8px;
            border: none;
            background: #444;
            color: white;
        }

        .chatbot-form button {
            padding: 0.5rem 1rem;
            background: #7c4dff;
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
        }

        .message-user {
            text-align: right;
            color: #90caf9;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .message-bot {
            text-align: left;
            background: #2e2e4d;
            color: white;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 1rem;
        }

        .thinking {
            font-style: italic;
            text-align: center;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="chatbot-body" id="chatContent">
        {% for message in chat_history %}
            <div class="message-user">You: {{ message.user }}</div>
            <div class="message-bot">{{ message.bot|safe }}</div>
        {% endfor %}
    </div>
    <form id="chatForm" class="chatbot-form">
        <input id="chatInput" type="text" placeholder="Ask me anything..." autocomplete="off" required />
        <button type="submit">➤</button>
    </form>

    <script>
        const chatContent = document.getElementById("chatContent");
        const chatForm = document.getElementById("chatForm");
        const chatInput = document.getElementById("chatInput");

        function scrollToBottom() {
            chatContent.scrollTop = chatContent.scrollHeight;
        }

        function showThinking() {
            const loader = document.createElement("div");
            loader.className = "thinking";
            loader.id = "thinking-indicator";
            loader.innerText = "🤖 AmiBot is thinking...";
            chatContent.appendChild(loader);
            scrollToBottom();
        }

        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            const userMsg = document.createElement("div");
            userMsg.className = "message-user";
            userMsg.innerText = "You: " + userText;
            chatContent.appendChild(userMsg);

            showThinking();
            chatInput.value = "";

            const res = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_input: userText })
            });

            const data = await res.json();

            document.getElementById("thinking-indicator")?.remove();

            const botMsg = document.createElement("div");
            botMsg.className = "message-bot";
            botMsg.innerHTML = data.bot;
            chatContent.appendChild(botMsg);

            scrollToBottom();
        });

        window.onload = () => {
            scrollToBottom();
        };
    </script>
</body>
</html>
"""

@app.route("/clear_chat", methods=["POST"])
def clear_chat():
    session.pop("chat_history", None)
    return jsonify({"status": "cleared"})

@app.route("/", methods=["GET", "POST"])
def chat():
    if "chat_history" not in session:
        session["chat_history"] = []

    if request.method == "POST" and request.is_json:
        user_input = request.json.get("user_input")
        response = get_chatbot_response(user_input)
        session["chat_history"].append({"user": user_input, "bot": response})
        session.modified = True
        return jsonify({"user": user_input, "bot": response})

    return render_template_string(HTML_TEMPLATE, chat_history=session.get("chat_history", []))

if __name__ == "__main__":
    app.run(debug=True)
