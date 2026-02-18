import {
  ChartArea,
  ShoppingBasket,
  Database,
  ClipboardClock,
  LogOut,
  X,
  Megaphone,
  CircleUser,
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
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { useSidebar } from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { useAuth0 } from "@auth0/auth0-react";

// Menu items
const items = [
  { title: "Dashboard", url: "/", icon: ChartArea },
  { title: "Announcement", url: "/announcement", icon: Megaphone },
  { title: "Point of Sale", url: "/pos", icon: ShoppingBasket },
  { title: "Inventory", url: "/inventory", icon: Database },
  { title: "Transactions", url: "/transactions", icon: ClipboardClock },
  { title: "Logout", url: "/login", icon: LogOut },
];

export function Sidebar() {
  const { toggleSidebar } = useSidebar();
  const { logout, user } = useAuth0();

  return (
    <ShadcnSidebar>
      <SidebarContent className="bg-background flex flex-col h-full relative">
        {/* Close button at the top-right */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-1 rounded hover:bg-muted cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <SidebarGroup className="flex flex-col flex-1 justify-between">
          <div>
            <SidebarHeader className=" font-bold text-xl">
              Inventory System
            </SidebarHeader>
            <Separator className="mb-4" />
            <SidebarGroupContent>
              <SidebarMenu>
                {items.slice(0, -1).map((item) => (
                  <SidebarMenuItem key={item.title} className="mb-2 ml-2">
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2 transition-colors duration-200"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>

          {/* Last item sticks to the bottom */}
          <SidebarMenu className="mb-2">
            {items.slice(-1).map((item) => (
              <SidebarMenuItem key={item.title}>
                {/* Bottom User Section */}
                <div className="mt-auto p-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt={user?.name ?? "User"}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <CircleUser className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {user?.name ?? "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email ?? "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <SidebarMenuButton
                  onClick={() =>
                    logout({
                      logoutParams: {
                        returnTo: `${window.location.origin}`,
                      },
                    })
                  }
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-accent transition-colors duration-200"
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
