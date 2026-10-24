"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_MENU_ITEM } from "@/constants/dashboard-menu-type";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  menus: DASHBOARD_MENU_ITEM[];
  label?: string;
}
export const DashboardMenu = ({ menus, label }: Props) => {
  const pathName = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>

      <SidebarMenu>
        {menus.map((item) => (
          <Link href={item.url} key={item.url}>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathName === item.url}
              >
                {item.icon && <item.icon />}
                <span className="font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
