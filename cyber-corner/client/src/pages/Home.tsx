import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  ArrowRight, Printer, Wifi, Monitor, ScanLine, Phone, FileText, Bell, 
  Smartphone, CreditCard, Landmark, Zap, Image, ShieldCheck, ClipboardCheck, 
  UserCheck, Globe, Train, FileEdit, Download, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { useI18n } from "@/lib/i18n";
import { useNotices } from "@/hooks/use-service-requests";

const serviceIconMap: Record<string, any> = {
  formFillup: FileEdit,
  aadhaarDownload: Download,
  panCard: CreditCard,
  passport: Globe,
  mobileRecharge: Smartphone,
  railwayTicket: Train,
  dataRecharge: Wifi,
  electricityBill: Zap,
  xerox: ScanLine,
  cashWithdrawal: Landmark,
  printing: Printer,
  lamination: ShieldCheck,
  photoPrint: Image,
  tradeLicence: ClipboardCheck,
  udyamReg: CheckCircle,
  vehicleTax: Landmark,
  cmcVellore: UserCheck,
  driverAuth: ShieldCheck,
  onlineApps: Monitor,
};

export default function Home() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const { notices } = useNotices();

  const services = Object.entries(t.services).map(([key, name]) => ({
    name,
    Icon: serviceIconMap[key] || FileText,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border-b border-primary/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2], 
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-8xl font-bold mb-6 font-display tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                {t.heroTitle}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-2xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t.heroDesc}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                onClick={() => setLocation("/request")}
                className="group h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:scale-105"
              >
                {t.getStarted}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation("/track")}
                className="h-14 px-8 text-lg font-semibold border-white/20 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:scale-105"
              >
                {t.trackRequest}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              {t.servicesTitle}
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map(({ name, Icon }) => (
              <motion.div
                key={name}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card 
                  className="group cursor-pointer h-full border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 overflow-hidden relative"
                  onClick={() => setLocation(`/request?service=${encodeURIComponent(name)}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="flex flex-col items-center gap-4 p-8 text-center relative z-10">
                    <div className="p-4 bg-primary/5 rounded-2xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500 shadow-inner">
                      <Icon className="h-8 w-8 text-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-500" />
                    </div>
                    <p className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-300">{name}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-primary text-sm font-medium flex items-center">
                      Request Now <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {notices.length > 0 && (
        <section className="py-24 px-4 bg-muted/30 border-y border-border/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-10 justify-center md:justify-start"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold">{t.noticesTitle}</h2>
            </motion.div>
            <div className="space-y-6">
              {notices.map((notice: any, i: number) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:border-primary/20 transition-all duration-300 shadow-sm overflow-hidden group">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      {notice.imageUrl && (
                        <div className="w-full md:w-48 lg:w-64 aspect-video md:aspect-square overflow-hidden rounded-xl shrink-0">
                          <img 
                            src={notice.imageUrl.startsWith('http') ? notice.imageUrl : `/uploads/${notice.imageUrl}`} 
                            alt={notice.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">{notice.title}</h3>
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="flex-1" />
      <Footer />
      <WhatsAppFloat />
    </motion.div>
  );
}
