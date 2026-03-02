import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { useI18n } from "@/lib/i18n";
import { useLocation } from "wouter";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  serviceType: z.string().min(1, "Please select a service type"),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function RequestForm() {
  const { t } = useI18n();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const prefillService = searchParams.get("service");

  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: "",
    }
  });

  const selectedService = watch("serviceType");

  useEffect(() => {
    if (prefillService) {
      // Find the service name that matches the prefill ID or name
      const serviceName = Object.values(t.services).find(
        s => s.toLowerCase().includes(prefillService.toLowerCase())
      ) || prefillService;
      
      setValue("serviceType", serviceName);
    }
  }, [prefillService, setValue, t.services]);

  const onSubmit = async (data: FormData) => {
    setError("");
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("serviceType", data.serviceType);
    if (data.message) formData.append("message", data.message);
    if (file) formData.append("document", file);

    const res = await fetch("/api/requests", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Submission failed. Please try again.");
      return;
    }
    setSubmitted(true);
    reset();
    setFile(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.submitted}</h2>
            <p className="text-muted-foreground mb-6">Use your phone number to track your request.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
              <Button variant="outline" onClick={() => window.location.href = "/track"}>Track Request</Button>
            </div>
          </motion.div>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  const serviceOptions = Object.values(t.services);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t.request}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t.name} *</Label>
                    <Input id="name" {...register("name")} placeholder="Your full name" className="mt-1 focus-visible:ring-primary/50" />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">{t.phone} *</Label>
                    <Input id="phone" {...register("phone")} placeholder="10-digit mobile number" className="mt-1 focus-visible:ring-primary/50" />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="serviceType">{t.serviceType} *</Label>
                    <Select 
                      onValueChange={(val) => setValue("serviceType", val)}
                      value={selectedService}
                    >
                      <SelectTrigger className="mt-1 focus:ring-primary/50">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceType && <p className="text-destructive text-sm mt-1">{errors.serviceType.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message">{t.message}</Label>
                    <Textarea id="message" {...register("message")} placeholder="Any additional details" className="mt-1 focus-visible:ring-primary/50" />
                  </div>

                  <div>
                    <Label htmlFor="document">{t.document} (PDF/JPG/PNG, Max 5MB)</Label>
                    <div className="mt-1 flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("document")?.click()}
                        className="w-full flex items-center gap-2 hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        {file ? file.name : "Choose File"}
                      </Button>
                      <input
                        id="document"
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.submitting : t.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
