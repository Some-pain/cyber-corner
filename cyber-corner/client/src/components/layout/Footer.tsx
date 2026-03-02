import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Phone, MapPin, Monitor, ExternalLink, Mail, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation, Link } from "wouter";

export default function Footer() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  const handleServiceClick = (serviceName: string) => {
    setLocation(`/request?service=${encodeURIComponent(serviceName)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-slate-950 text-slate-200 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">CYBER CORNER</h3>
            </div>
            <div className="space-y-3">
              <p className="text-slate-400 text-sm leading-relaxed">{t.owner}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{t.heroDesc}</p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://wa.me/916297320156" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-green-500/20 hover:text-green-400 transition-all">
                <FaWhatsapp className="h-5 w-5" />
              </a>
              <a href="tel:9832450395" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Quick Links
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors" /> {t.home}
                </Link>
              </li>
              <li>
                <Link href="/request" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors" /> {t.request}
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors" /> {t.track}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" /> {t.servicesTitle}
            </h4>
            <ul className="grid grid-cols-1 gap-3 text-sm">
              {Object.entries(t.services).slice(0, 8).map(([key, name]) => (
                <li key={key}>
                  <button 
                    onClick={() => handleServiceClick(name)}
                    className="text-slate-400 hover:text-primary transition-colors text-left group flex items-center gap-2 w-full"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors shrink-0" />
                    <span className="truncate">{name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> Contact Us
            </h4>
            <div className="space-y-6 text-sm text-slate-400">
              <div className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">{t.footerAddress}</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span>9832450395</span>
                  <span>6297320156</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-2">WhatsApp for quick support</p>
                <a
                  href="https://wa.me/916297320156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 font-medium"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  <span>{t.whatsapp}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs uppercase tracking-widest">
          <p>© {new Date().getFullYear()} CYBER CORNER. {t.footerRights}</p>
          <p>Designed with excellence</p>
        </div>
      </div>
    </motion.footer>
  );
}
