import { useServices } from "@/hooks/use-services";
import { 
  PhoneCall, Users, BarChart3, Globe, Shield, Zap, 
  MessageSquare, Settings, Headphones, Layers
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  PhoneCall, Users, BarChart3, Globe, Shield, Zap, 
  MessageSquare, Settings, Headphones, Layers
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export function Services() {
  const { data: services, isLoading, error } = useServices();

  return (
    <section id="services" className="py-24 relative bg-card/50 border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            AI Powered <span className="text-primary">Automation</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg"
          >
            Next-generation sales automation tools built to scale your business and 
            streamline your calling workflows with pinpoint accuracy.
          </motion.p>
        </div>

        {error && (
          <div className="text-center p-8 bg-destructive/10 border border-destructive/20 rounded-2xl">
            <p className="text-destructive font-medium">Failed to load services. Please try again later.</p>
          </div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-8 rounded-2xl bg-card border border-border h-[280px] flex flex-col">
                <Skeleton className="w-14 h-14 rounded-xl mb-6 bg-white/5" />
                <Skeleton className="h-6 w-3/4 mb-4 bg-white/5" />
                <Skeleton className="h-4 w-full mb-2 bg-white/5" />
                <Skeleton className="h-4 w-5/6 bg-white/5" />
              </div>
            ))
          ) : (
            services?.map((service) => {
              const IconComponent = iconMap[service.iconUrl || 'Zap'] || Zap;
              
              return (
                <motion.div 
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                  }}
                  className="group relative bg-card border border-border p-8 rounded-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    
                    {service.category && (
                      <div className="mt-4 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {service.category}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}