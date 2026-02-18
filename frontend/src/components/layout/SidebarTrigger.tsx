import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function SidebarTrigger() {
  const { toggleSidebar, state, isMobile } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-9 w-9"
    >
      {/* Changing the icon based on collapse state */}
      {isMobile ? (
        <Menu className="h-5 w-5" />
      ) : isCollapsed ? (
        <PanelLeftOpen className="h-5 w-5" />
      ) : (
        <PanelLeftClose className="h-5 w-5" />
      )}
    </Button>
  );
}
