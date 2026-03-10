import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { label: "Calls Per Day", value: 1000, suffix: "+" },
  { label: "Accuracy Rate", value: 95, suffix: "%" },
  { label: "Availability", value: 24, suffix: "/7" },
];

const steps = [
  { title: "Lead Ingestion", description: "CRM leads automatically sync to CallPilotAI." },
  { title: "Smart Outreach", description: "AI agents initiate calls at optimal times." },
  { title: "Live Interaction", description: "Natural conversations with sub-second latency." },
  { title: "CRM Update", description: "Call outcomes and transcripts synced back." },
];

export function Features() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl glass-panel text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            How <span className="text-primary">Calls Work</span>
          </h2>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1 text-right hidden md:block">
                    {idx % 2 === 0 && (
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                    {idx + 1}
                  </div>
                  
                  <div className="flex-1 text-left">
                    {(idx % 2 !== 0 || window.innerWidth < 768) && (
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}