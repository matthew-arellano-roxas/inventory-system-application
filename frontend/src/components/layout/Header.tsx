import { SidebarTrigger } from "@/components/ui/sidebar"; // adjust path

export function Header() {
  return (
    <header className="flex items-center gap-3 border-b pb-4">
      <SidebarTrigger />
    </header>
  );
}
