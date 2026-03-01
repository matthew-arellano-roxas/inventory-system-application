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
      className="h-11 w-11 rounded-xl"
    >
      {/* Changing the icon based on collapse state */}
      {isMobile ? (
        <Menu className="h-6 w-6" />
      ) : isCollapsed ? (
        <PanelLeftOpen className="h-6 w-6" />
      ) : (
        <PanelLeftClose className="h-6 w-6" />
      )}
    </Button>
  );
}
