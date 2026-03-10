import { BrainCircuit, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-tr from-primary to-accent p-1.5 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-wide">
                Nexus<span className="text-primary">-CallPilotAI</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Automating your sales calls with human-like AI agents. 24/7 availability, 95% accuracy, and seamless CRM integration.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Solutions</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#services" className="hover:text-primary transition-colors">Voice AI Agents</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Lead Management</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Call Analytics</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Automation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="mailto:kalegaurav287@gmail.com" className="p-2 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Nexus-CallPilotAI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
