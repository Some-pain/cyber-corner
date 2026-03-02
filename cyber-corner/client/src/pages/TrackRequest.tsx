import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { useI18n } from "@/lib/i18n";
import type { ServiceRequest } from "@shared/schema";

export default function TrackRequest() {
  const { t } = useI18n();
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<ServiceRequest[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/track-request?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">{t.track}</h1>
            <p className="text-muted-foreground mb-8">{t.trackPhone}</p>

            <div className="flex gap-3 mb-8">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {t.search}
              </Button>
            </div>

            {error && <p className="text-destructive text-sm mb-4">{error}</p>}

            {results !== null && (
              <div>
                {results.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      {t.noRecords}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {results.map((req, i) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{req.serviceType}</CardTitle>
                              <Badge variant={req.status === "Completed" ? "default" : "secondary"}
                                className={req.status === "Completed" ? "bg-green-500" : "bg-yellow-500 text-white"}>
                                {req.status === "Completed" ? t.completed : t.pending}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 text-sm text-muted-foreground space-y-1">
                            <p><span className="font-medium text-foreground">{t.name}:</span> {req.name}</p>
                            {req.message && <p><span className="font-medium text-foreground">{t.message}:</span> {req.message}</p>}
                            {req.adminNotes && (
                              <p className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs">
                                <span className="font-semibold">{t.adminNotes}:</span> {req.adminNotes}
                              </p>
                            )}
                            <p className="text-xs">{new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
