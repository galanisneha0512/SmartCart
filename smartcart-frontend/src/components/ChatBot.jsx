import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const BUYER_SUGGESTIONS = [
  "Best products under ₹1000?",
  "What headphones do you have?",
  "Compare your water bottles",
  "What's popular right now?",
];

const SELLER_SUGGESTIONS = [
  "How can I increase my sales?",
  "Which of my products needs restocking?",
  "How should I price my products?",
  "Tips to get more orders?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white border border-stone-200 rounded-2xl rounded-tl-sm w-fit">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function ChatBot({ mode = "buyer" }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const isSeller = mode === "seller";
  const suggestions = isSeller ? SELLER_SUGGESTIONS : BUYER_SUGGESTIONS;
  const botName = isSeller ? "Store Advisor 📊" : "Shopping Assistant 🛍️";
  const greeting = isSeller
    ? `Hi ${user?.name?.split(" ")[0] || ""}! I'm your store advisor. Ask me anything about growing your business, managing inventory, or boosting sales!`
    : `Hi ${user?.name?.split(" ")[0] || ""}! I'm your shopping assistant. Ask me anything about our products and I'll help you find the perfect match!`;

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "model", text: greeting }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", text: text.trim() };
    const history = messages.filter(
      (m) => m.role !== "model" || messages.indexOf(m) > 0,
    );

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat/", {
        message: text.trim(),
        history: history.slice(-6), // last 6 messages for context
        mode,
      });
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, I'm having trouble responding right now. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 sm:w-96 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-stone-900 text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-sm font-semibold">{botName}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-white transition-colors text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-stone-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-stone-900 text-white rounded-tr-sm"
                      : "bg-white border border-stone-200 text-stone-800 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}

            {/* Suggestions — only show at start */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs text-stone-400 font-medium">
                  Try asking:
                </p>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-left text-xs px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-stone-100 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus-within:border-orange-400 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isSeller ? "Ask about your store..." : "Ask about products..."
                }
                disabled={loading}
                className="flex-1 text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-7 h-7 bg-stone-900 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all disabled:opacity-40 shrink-0 text-xs font-bold"
              >
                ↑
              </button>
            </div>
            <p className="text-[10px] text-stone-600 text-center mt-1.5">
              Powered by Groq AI ⚡
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-stone-900 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110 flex items-center justify-center text-2xl"
      >
        {open ? "✕" : isSeller ? "📊" : "🛍️"}
      </button>
    </>
  );
}
