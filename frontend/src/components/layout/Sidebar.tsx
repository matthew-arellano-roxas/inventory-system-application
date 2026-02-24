import {
  ChartArea,
  ShoppingBasket,
  Database,
  ClipboardClock,
  LogOut,
  Megaphone,
  CircleUser,
  X, // Close icon
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // Import the hook
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { Separator } from "../ui/separator";
import { useAuth0 } from "@auth0/auth0-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: ChartArea },
  { title: "Announcement", url: "/announcement", icon: Megaphone },
  { title: "Point of Sale", url: "/pos", icon: ShoppingBasket },
  { title: "Inventory", url: "/inventory", icon: Database },
  { title: "Transactions", url: "/transactions", icon: ClipboardClock },
];

export function Sidebar() {
  const { logout, user } = useAuth0();
  const location = useLocation();

  // Destructure toggleSidebar from the hook
  const { toggleSidebar } = useSidebar();

  return (
    <ShadcnSidebar className="border-r border-border/50">
      <SidebarContent className="bg-card flex flex-col h-full relative">
        <SidebarHeader className="p-4 pt-6">
          <div className="flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-2 px-2">
              <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
                <Database className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                StockFlow
              </span>
            </div>

            {/* Manual Close Button */}
            <button
              onClick={() => toggleSidebar()}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Toggle Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </SidebarHeader>

        <SidebarGroup className="px-4 flex-1">
          {/* ... navigation items remain same ... */}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-2 opacity-70">
            Main Menu
          </p>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "h-10 px-3 transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "hover:bg-muted",
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer Section */}
        <div className="mt-auto p-4 space-y-4">
          <Separator className="opacity-50" />

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/30 border border-transparent overflow-hidden">
            <div className="h-9 w-9 rounded-full border border-border overflow-hidden bg-muted flex-shrink-0">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="User"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <CircleUser className="h-full w-full p-1 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate leading-none mb-1">
                {user?.name ?? "User"}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {user?.email ?? "Guest"}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <SidebarMenuButton
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className={cn(
              "w-full flex items-center justify-center gap-2 h-11 transition-all duration-200 rounded-lg border",
              "bg-destructive/5 text-destructive border-destructive/10",
              "hover:bg-destructive hover:text-white hover:border-destructive shadow-sm",
            )}
          >
            <LogOut className="w-4 h-4 text-inherit" />
            <span className="font-semibold text-sm">Logout Session</span>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
