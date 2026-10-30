import {
  CalendarCog,
  ChartColumn,
  LayoutDashboard,
  ListIcon,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { DASHBOARD_MENU_ITEM } from "./dashboard-menu-type";

export const ADMIN_MENUS_OVERVIEW: DASHBOARD_MENU_ITEM[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
];

export const ADMIN_MENUS_MAIN: DASHBOARD_MENU_ITEM[] = [
  { title: "Sales", url: "/admin/sales", icon: TrendingUp },
  { title: "Finance", url: "/admin/finance", icon: Wallet },
  { title: "Analytics", url: "/admin/analytics", icon: ChartColumn },
  { title: "Orders", url: "/admin/orders", icon: Package },
];

export const ADMIN_MENUS_E_COMMERCE: DASHBOARD_MENU_ITEM[] = [
  { title: "Products", url: "/admin/products", icon: ShoppingCart },
  { title: "Categories", url: "/admin/categories", icon: CalendarCog },
  { title: "Sub Categories", url: "/admin/sub-categories", icon: ListIcon },
];
