import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Trash2, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/hooks/use-auth";
import { useServiceRequests } from "@/hooks/use-service-requests";
import type { ServiceRequest } from "@shared/schema";

export default function AdminRequests() {
  const [, setLocation] = useLocation();
  const { admin, isLoading } = useAuth();
  const { requests, updateRequest, deleteRequest } = useServiceRequests();

  useEffect(() => {
    if (!isLoading && !admin) setLocation("/admin/login");
  }, [admin, isLoading]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!admin) return null;

  const handleStatusChange = async (req: ServiceRequest, status: string) => {
    await updateRequest({ id: req.id, status });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this request?")) await deleteRequest(id);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Service Requests</h1>
          <div className="space-y-3">
            {requests.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">No requests yet.</CardContent>
              </Card>
            )}
            {requests.map((req, i) => (
              <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{req.name}</span>
                          <Badge variant={req.status === "Completed" ? "default" : "secondary"}
                            className={req.status === "Completed" ? "bg-green-500" : "bg-yellow-500 text-white"}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.phone} · {req.serviceType}</p>
                        {req.message && <p className="text-sm mt-1">{req.message}</p>}
                        {req.documentFile && (
                          <a href={`/uploads/${req.documentFile}`} target="_blank" rel="noopener noreferrer"
                            className="text-primary text-xs flex items-center gap-1 mt-1 hover:underline">
                            <ExternalLink className="h-3 w-3" /> View Document
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(req.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Select value={req.status} onValueChange={(val) => handleStatusChange(req, val)}>
                          <SelectTrigger className="w-36 h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(req.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
