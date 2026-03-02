import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const [location] = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/request", label: t.request },
    { href: "/track", label: t.track },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Monitor className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-display">
            CYBER CORNER
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm font-semibold transition-all duration-300 hover:text-primary cursor-pointer relative py-2 ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}>
                {link.label}
                {location === link.href && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]"
                  />
                )}
              </span>
            </Link>
          ))}
          
          <div className="flex items-center gap-3 pl-4 border-l border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="gap-2 font-bold border-primary/20 hover:bg-primary/5 hover:border-primary/40 rounded-full transition-all"
            >
              <Globe className="h-4 w-4 text-primary" />
              {lang === "en" ? "বাংলা" : "English"}
            </Button>
            <Link href="/admin/login">
              <Button size="sm" variant="ghost" className="text-muted-foreground font-semibold hover:text-primary rounded-full">
                {t.adminLogin}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Nav Trigger */}
        <div className="flex md:hidden items-center gap-3">
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="font-bold text-primary"
          >
            {lang === "en" ? "বাং" : "EN"}
          </Button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2.5 bg-primary/10 rounded-xl text-primary hover:bg-primary/20 transition-all active:scale-95"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-[320px] bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-[0_0_40px_rgba(0,0,0,0.3)] p-6 md:hidden flex flex-col"
            >
              <div className="flex justify-end mb-8">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className={`text-xl font-bold transition-colors cursor-pointer ${
                      location === link.href ? "text-primary" : "text-foreground/70"
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-border/50 space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 rounded-xl border-primary/20"
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                >
                  <Globe className="h-5 w-5 text-primary" />
                  {lang === "en" ? "Switch to Bengali" : "Switch to English"}
                </Button>
                <Link href="/admin/login">
                  <Button variant="secondary" className="w-full h-12 rounded-xl font-bold">
                    {t.adminLogin}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
