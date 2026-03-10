import { Lightbulb, Cog, Rocket } from "lucide-react";

export function Process() {
  const steps = [
    {
      icon: Lightbulb,
      title: "Strategy & Setup",
      description: "We analyze your sales process and configure the AI voice agents to match your brand's tone and goals.",
      step: "01"
    },
    {
      icon: Cog,
      title: "Agent Training",
      description: "Our AI is trained on your specific scripts and knowledge base, ensuring 95% accuracy in live calls.",
      step: "02"
    },
    {
      icon: Rocket,
      title: "Live Automation",
      description: "Agents go live, handling 1000+ calls/day with real-time CRM syncing and automated follow-ups.",
      step: "03"
    }
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="text-accent">Workflow</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A streamlined, four-stage process to deploy your custom AI voice agents and start automating your sales pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <s.icon className="w-10 h-10 text-foreground group-hover:text-accent transition-colors" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-accent">
                  {s.step}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
