import { useState } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://vetchat-backend.onrender.com/chat",
        { message: input }
      );
      const botMsg = { role: "bot", content: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg = { role: "bot", content: "⚠️ Server error, try again later." };
      setMessages((prev) => [...prev, botMsg]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#1C1C1C] text-[#C2B280]">
      <h1 className="text-3xl mb-6 font-bold text-[#4B5320]">VetChat 🪖</h1>

      <div className="w-full max-w-md bg-[#2A2A2A] rounded-2xl shadow-lg p-4 flex flex-col gap-4">
        <div className="h-96 overflow-y-auto flex flex-col gap-2 p-2 border border-[#4B5320] rounded-xl">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl max-w-[80%] ${
                msg.role === "user"
                  ? "bg-[#4B5320] text-white self-end"
                  : "bg-[#C2B280] text-black self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-gray-400 italic">AI is typing...</div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded-lg text-black"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-[#4B5320] text-white px-4 py-2 rounded-lg hover:bg-[#3C4218]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
