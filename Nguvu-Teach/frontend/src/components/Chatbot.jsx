// ============================================
// Nguvu-Teach Floating Chatbot Widget
// File: src/components/Chatbot.jsx
// Purpose: Interactive AI support assistant widget
// that connects to /api/chat (Gemini-powered backend)
// ============================================

import { useState, useRef, useEffect } from "react";
import apiClient from "../api/client";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your Nguvu-Teach Support Assistant. How can I help you with our courses or application process today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Ref for auto-scrolling message body to bottom
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change or typing state updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle sending a message
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Append user message immediately
    const userMessage = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await apiClient.post("/api/chat", { message: trimmed });
      const botReply =
        response.data.reply || "Sorry, I could not process that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I am having a brief moment of disconnection, but I'm still right here! Please feel free to try your message again, or head down to our contact section to reach our support team directly.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ========== Chat Window ========== */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#8A0030] to-[#b91c5a] text-white">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">
                Nguvu-Teach Support
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs opacity-80">Online</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Message Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#8A0030] text-white rounded-br-sm"
                      : "bg-white text-slate-700 border border-gray-100 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="px-3 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                placeholder={
                  isTyping ? "Waiting for reply..." : "Type your message..."
                }
                className="flex-1 px-4 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-full outline-none focus:border-[#8A0030] focus:ring-2 focus:ring-[#8A0030]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#8A0030] text-white hover:bg-[#6d0026] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19V5m0 0l-7 7m7-7l7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Floating Action Button ========== */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center z-50 ${isOpen ? "bg-slate-700 hover:bg-slate-800" : "bg-[#8A0030] hover:bg-[#6d0026]"}`}
        aria-label="Toggle chat assistant"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </>
  );
};

export default Chatbot;
