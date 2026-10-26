"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AdminDashboardHeader } from "./admin-dashboard-header";
import { DashboardMenu } from "./dashboard-menu";
import {
  ADMIN_MENUS_E_COMMERCE,
  ADMIN_MENUS_MAIN,
  ADMIN_MENUS_OVERVIEW,
} from "@/constants/admin-menus";
import { AdminDashboardUser } from "./admin-dashboard-user";
import { Suspense } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminDashboardHeader />
      </SidebarHeader>
      <SidebarContent>
        <Suspense>
          <DashboardMenu menus={ADMIN_MENUS_OVERVIEW} label="Overview" />
          <DashboardMenu menus={ADMIN_MENUS_MAIN} label="Dashboard" />
          <DashboardMenu menus={ADMIN_MENUS_E_COMMERCE} label="eCommerce" />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <AdminDashboardUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
