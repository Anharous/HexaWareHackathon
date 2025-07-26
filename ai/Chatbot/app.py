from flask import Flask, render_template_string, request, session, jsonify
from datetime import timedelta
import google.generativeai as genai

# Configure Gemini API
gemini_api_key = "AIzaSyDd2XRE-1pwXynl1jI7XPrQ8LJTcI-xsu4"
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        :root {
            --secondary-bg: #1e1e3f;
            --accent-color: #7c4dff;
            --text-light: #f5f5f5;
            --text-muted: #888;
            --bot-gradient: linear-gradient(135deg, #7c4dff 0%, #64b5f6 100%);
            --box-shadow: 0px 6px 30px rgba(124, 77, 255, 0.25);
            --radius: 20px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--primary-bg);
            color: var(--text-light);
            margin: 0;
            padding: 0;
        }

        .chatbot-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bot-gradient);
            border: none;
            border-radius: 50%;
            width: 70px;
            height: 70px;
            font-size: 28px;
            color: white;
            cursor: pointer;
            box-shadow: var(--box-shadow);
            z-index: 1000;
        }

        .chatbot-window {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 380px;
            max-height: 600px;
            background-color: var(--secondary-bg);
            border-radius: var(--radius);
            box-shadow: var(--box-shadow);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 999;
        }

        .chatbot-header {
            background: var(--accent-color);
            padding: 1rem;
            font-weight: bold;
            font-size: 1.3rem;
            text-align: center;
            color: white;
            border-top-left-radius: var(--radius);
            border-top-right-radius: var(--radius);
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
        }

        .header-title {
            flex-grow: 1;
            text-align: center;
            margin-left: -2rem; /* center text with buttons */
        }

        .close-btn, .clear-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            font-weight: 700;
            padding: 0 0.5rem;
            border-radius: 6px;
            transition: background-color 0.2s ease;
        }

        .close-btn:hover, .clear-btn:hover {
            background-color: rgba(255,255,255,0.15);
        }

        .chatbot-body {
            padding: 1rem;
            overflow-y: auto;
            flex: 1;
            max-height: 400px;
        }

        .chatbot-form {
            padding: 0.75rem;
            display: flex;
            gap: 0.5rem;
            background: var(--secondary-bg);
            border-top: 1px solid #3c3c5c;
        }

        .chatbot-form input {
            flex: 1;
            padding: 0.5rem;
            border-radius: 10px;
            border: 1px solid #888;
            background-color: #2e2e4d;
            color: #fff;
            font-size: 1rem;
        }

        .chatbot-form button {
            background: var(--bot-gradient);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1.1rem;
        }

        .message-user {
            text-align: right;
            color: #90caf9;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .message-bot {
            text-align: left;
            background: #2a2a48;
            color: var(--text-light);
            margin-bottom: 0.5rem;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.95rem;
            line-height: 1.5;
            box-shadow: var(--box-shadow);
            white-space: pre-wrap;
        }

        .message-bot h2, .message-bot h3 {
            font-size: 1.1rem;
            margin: 1rem 0 0.5rem;
            color: #a29bfe;
        }

        .thinking {
            font-style: italic;
            color: var(--text-muted);
            text-align: center;
            margin: 1rem 0;
            animation: blink 1.2s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body>
    <button class='chatbot-button' id="toggleBtn">💬</button>

    <div class='chatbot-window' id='chatbotWindow'>
        <div class='chatbot-header'>
            <button class="clear-btn" id="clearBtn" title="Clear Chat">🧹</button>
            <div class="header-title">AmiBot ✨ — Your AI Buddy</div>
            <button class="close-btn" id="closeBtn" title="Close Chat">×</button>
        </div>
        <div class='chatbot-body' id='chatContent'>
            {% for message in chat_history %}
                <div class='message-user'>You: {{ message.user }}</div>
                <div class='message-bot'>{{ message.bot|safe }}</div>
            {% endfor %}
        </div>
        <form method='post' class='chatbot-form' onsubmit='showThinking();'>
            <input type='text' name='user_input' placeholder='Ask me anything...' autocomplete="off" required>
            <button type='submit'>➤</button>
        </form>
    </div>

    <script>
        const chatWindow = document.getElementById("chatbotWindow");
        const toggleBtn = document.getElementById("toggleBtn");
        const closeBtn = document.getElementById("closeBtn");
        const clearBtn = document.getElementById("clearBtn");
        const chatContent = document.getElementById("chatContent");

        toggleBtn.addEventListener("click", () => {
            if(chatWindow.style.display === "flex"){
                chatWindow.style.display = "none";
                clearChat();
            } else {
                chatWindow.style.display = "flex";
                scrollToBottom();
                chatContent.querySelector("#thinking-indicator")?.remove();
            }
        });

        closeBtn.addEventListener("click", () => {
            chatWindow.style.display = "none";
            clearChat();
        });

        clearBtn.addEventListener("click", () => {
            clearChat();
        });

        function clearChat(){
            fetch('/clear_chat', {method: 'POST'}).then(() => {
                // Clear chat visually too
                chatContent.innerHTML = "";
            });
        }

        function scrollToBottom() {
            setTimeout(() => {
                chatContent.scrollTop = chatContent.scrollHeight;
            }, 100);
        }

        function showThinking() {
            if(chatContent.querySelector(".thinking")) return;
            const loader = document.createElement("div");
            loader.className = "thinking";
            loader.id = "thinking-indicator";
            loader.innerText = "🤖 AmiBot is thinking...";
            chatContent.appendChild(loader);
            scrollToBottom();
        }

        window.onload = () => {
            if(chatWindow.style.display === "flex") scrollToBottom();
        };
    </script>
</body>
</html>
"""

@app.route("/clear_chat", methods=["POST"])
def clear_chat():
    session.pop("chat_history", None)
    return jsonify({"status":"cleared"})

@app.route("/", methods=["GET", "POST"])
def chat():
    if "chat_history" not in session:
        session["chat_history"] = []

    if request.method == "POST":
        user_input = request.form["user_input"]
        response = get_chatbot_response(user_input)
        session["chat_history"].append({"user": user_input, "bot": response})
        session.modified = True

    return render_template_string(HTML_TEMPLATE, chat_history=session.get("chat_history", []))


if __name__ == "__main__":
    app.run(debug=True)
