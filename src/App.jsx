import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for saved phone on load
  useEffect(() => {
    const savedPhone = localStorage.getItem("vetchat_phone");
    if (savedPhone) {
      setPhone(savedPhone);
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ Phone number validation + login
  const handleLogin = () => {
    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length !== 10) {
      alert("❌ Please enter a valid 10-digit U.S. phone number (e.g., 555-123-4567).");
      return;
    }

    const formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    localStorage.setItem("vetchat_phone", formatted);
    setPhone(formatted);
    setIsLoggedIn(true);
  };

  // ✅ Send message to backend with phone included
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://vetchat-backend.onrender.com/chat", {
        message: input,
        phone,
      });
      const botMsg = { role: "bot", content: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg = { role: "bot", content: "⚠️ Server error, try again later." };
      setMessages((prev) => [...prev, botMsg]);
    }
    setLoading(false);
  };

  // ✅ Login screen before chat
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1C1C1C] text-[#C2B280]">
        <h1 className="text-3xl mb-6 font-bold text-[#4B5320]">VetChat 🪖</h1>
        <div className="bg-[#2A2A2A] p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4 w-80">
          <p>Enter your phone number to continue:</p>
          <input
            className="p-2 rounded-lg text-black w-full"
            placeholder="e.g. 555-123-4567"
            value={phone}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.length > 3 && val.length <= 6)
                val = `(${val.slice(0, 3)}) ${val.slice(3)}`;
              else if (val.length > 6)
                val = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6, 10)}`;
              setPhone(val);
            }}
          />
          <button
            onClick={handleLogin}
            className="bg-[#4B5320] text-white px-4 py-2 rounded-lg hover:bg-[#3C4218] w-full"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ✅ Chat screen after login
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
          {loading && <div className="text-sm text-gray-400 italic">AI is typing...</div>}
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
