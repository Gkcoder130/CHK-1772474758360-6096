import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "ai" | "user";
  content: string;
};

const FAQ_RESPONSES: Record<string, string> = {
  "How does it work?": "Nexus-CallPilotAI uses advanced LLMs and high-fidelity voice synthesis to interact with leads naturally. We integrate with your CRM to handle lead outreach autonomously.",
  "Pricing": "Our pricing scales with your call volume. We offer Pay-as-you-go and Enterprise plans. Contact our sales team for a custom quote!",
  "Industries Supported": "We excel in Real Estate, Solar, SaaS, and Insurance, but our AI can be trained for any domain.",
  "Integration": "We support native integrations with Salesforce, Hubspot, and thousands of others via Make.com and Zapier."
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm the Nexus-CallPilotAI assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    setTimeout(() => {
      const response = FAQ_RESPONSES[text] || "That's a great question! One of our human experts can provide more details. Would you like us to call you?";
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] glass-panel rounded-3xl overflow-hidden flex flex-col border border-primary/20"
          >
            {/* Header */}
            <div className="p-4 bg-primary/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">Nexus-CallPilotAI</div>
                  <div className="text-[10px] text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'ai' 
                        ? 'bg-secondary text-foreground rounded-tl-none' 
                        : 'bg-primary text-white rounded-tr-none'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="p-2 flex flex-wrap gap-2 border-t border-white/5 bg-background/40">
              {Object.keys(FAQ_RESPONSES).map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-[10px] px-2 py-1 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-background/60 flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                className="bg-secondary/50 border-white/5 rounded-full"
              />
              <Button size="icon" onClick={() => handleSend(inputValue)} className="rounded-full">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/20 text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}