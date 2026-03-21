"use client";

import { useState } from "react";
import { Send, Plus } from "lucide-react";

export function ChatMessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      // Here you would typically call an API to send the message
      setMessage("");
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md px-4 py-3 border-t border-zinc-800 max-w-md mx-auto">
      <div className="flex items-center space-x-3">
        <button className="text-zinc-500 p-2 rounded-full hover:bg-zinc-800 transition-colors">
          <Plus className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сообщение..."
            className="w-full h-12 bg-zinc-900 border-zinc-700 border rounded-2xl px-4 pr-12 text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-v-accent focus:border-v-accent transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-v-accent flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
       {/* iPhone Home Indicator Placeholder */}
       <div className="w-32 h-1.5 bg-zinc-600 rounded-full mx-auto mt-4 mb-1"></div>
    </footer>
  );
}
