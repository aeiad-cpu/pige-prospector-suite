import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Radar,
  LayoutGrid,
  Users,
  Phone,
  ListChecks,
  CalendarDays,
  AlertTriangle,
  Zap,
  UsersRound,
  Gift,
  ChevronLeft,
  ChevronRight,
  Target,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

const menuGroups = [
  {
    label: "Prospection",
    items: [
      { title: "Radar Live", url: "/", icon: Radar },
      { title: "Pipeline", url: "/pipeline", icon: LayoutGrid },
      { title: "Base de biens", url: "/vendeurs", icon: Users },
    ],
  },
  {
    label: "Exécution",
    items: [
      { title: "Power Dialer", url: "/dialer", icon: Phone },
      { title: "Cockpit Omnicanal", url: "/cockpit", icon: MessageSquare },
      { title: "Tâches", url: "/taches", icon: ListChecks },
      { title: "Agenda", url: "/agenda", icon: CalendarDays },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "RDV Annulés", url: "/noshows", icon: AlertTriangle },
    ],
  },
  {
    label: "Réglages",
    items: [
      { title: "Automatisation", url: "/automatisation", icon: Zap },
      { title: "Équipe", url: "/equipe", icon: UsersRound },
      { title: "Ambassadeur", url: "/ambassadeur", icon: Gift },
      { title: "Suggestions", url: "/suggestions", icon: Lightbulb },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-2">
        <Target className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-display text-lg font-bold text-foreground tracking-wider">
            PIGE IMMO
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {!collapsed && (
              <div className="px-4 py-2 text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  end
                  className={`flex items-center gap-3 px-4 py-2 mx-1 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  } ${collapsed ? "justify-center" : ""}`}
                  activeClassName=""
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
