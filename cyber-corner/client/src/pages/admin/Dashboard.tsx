import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/hooks/use-auth";
import { useAnalytics } from "@/hooks/use-service-requests";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { admin, isLoading } = useAuth();
  const { data: stats } = useAnalytics();

  useEffect(() => {
    if (!isLoading && !admin) setLocation("/admin/login");
  }, [admin, isLoading]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!admin) return null;

  const cards = [
    { label: "Total Requests", value: stats?.totalRequests ?? 0, icon: FileText, color: "text-blue-600" },
    { label: "Pending", value: stats?.pendingRequests ?? 0, icon: Clock, color: "text-yellow-600" },
    { label: "Completed", value: stats?.completedRequests ?? 0, icon: CheckCircle, color: "text-green-600" },
    { label: "Today", value: stats?.todayRequests ?? 0, icon: Calendar, color: "text-purple-600" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {admin.username}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{value}</div>
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
