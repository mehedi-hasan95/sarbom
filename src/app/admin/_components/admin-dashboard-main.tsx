import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "lucide-react";

const menus = [{ title: "Dashboard", url: "/admin", icon: User }];
export const AdminSidebarMain = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Sarbom</SidebarGroupLabel>

      <SidebarMenu>
        {menus.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
