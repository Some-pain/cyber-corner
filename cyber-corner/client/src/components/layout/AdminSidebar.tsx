import { Link, useLocation } from "wouter";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Bell, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Requests", url: "/admin/requests", icon: FileText },
    { title: "Notices", url: "/admin/notices", icon: Bell },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-sidebar-primary">
          <ShieldCheck className="h-6 w-6" />
          <span className="font-display font-bold text-lg text-sidebar-foreground">Admin Panel</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        w-full justify-start rounded-lg transition-colors
                        ${isActive 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 border-sidebar-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
