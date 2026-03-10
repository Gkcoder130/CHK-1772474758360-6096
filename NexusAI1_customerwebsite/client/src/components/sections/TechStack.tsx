import { motion } from "framer-motion";
import { SiTwilio, SiGooglesheets, SiOpenai } from "react-icons/si";
import { Zap } from "lucide-react";

const techs = [
  { name: "Retell AI", icon: SiOpenai, color: "text-[#00A67E]" },
  { name: "Twilio", icon: SiTwilio, color: "text-[#F22F46]" },
  { name: "Make.com", icon: Zap, color: "text-[#9B51E0]" },
  { name: "Google Sheets", icon: SiGooglesheets, color: "text-[#0F9D58]" },
];

export function TechStack() {
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-muted-foreground font-semibold mb-10 tracking-widest uppercase text-sm">
          Powered By Industry Leaders
        </h3>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {techs.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                opacity: { delay: idx * 0.1 },
                y: { 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: idx * 0.2
                }
              }}
              viewport={{ once: true }}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-panel"
            >
              <tech.icon className={`w-6 h-6 ${tech.color}`} />
              <span className="font-bold text-foreground">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}