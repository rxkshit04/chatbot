const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const clearChatBtn = document.getElementById("clearChat");
const toggleThemeBtn = document.getElementById("toggleTheme");
let isDarkTheme = false;

function addMessage(content, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.classList.add(isUser ? "user-message" : "bot-message");
  messageDiv.textContent = content;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = "";

  try {
    const typingDiv = addTypingIndicator();
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    messagesDiv.removeChild(typingDiv);
    addMessage(data.reply);
  } catch (error) {
    console.error("Fetch Error:", error);
    messagesDiv.removeChild(messagesDiv.lastChild);
    addMessage("Error: Could not connect to the bot.");
  }
}

function addTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot-message");
  typingDiv.innerHTML = 'Thinking<span class="dots">...</span>';
  messagesDiv.appendChild(typingDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return typingDiv;
}

function clearChat() {
  while (messagesDiv.firstChild) {
    messagesDiv.removeChild(messagesDiv.firstChild);
  }
  addMessage("Chat cleared!", false);
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle("dark-theme");
  toggleThemeBtn.innerHTML = isDarkTheme
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

// Event Listeners
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

clearChatBtn.addEventListener("click", clearChat);
toggleThemeBtn.addEventListener("click", toggleTheme);

// Initial welcome message
addMessage(
  "Hey there! I’m your Gemini Chat bot. How can I assist you today?",
  false
);
