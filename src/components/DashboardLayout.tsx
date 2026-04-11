import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import {
  Zap,
  Target,
  MessageSquareText,
  Bot,
  Settings,
  Bell,
  Crown,
  User,
  Menu,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Zap },
  { title: "Messages", url: "/messages", icon: MessageSquareText },
  { title: "Coach IA", url: "/coach", icon: Bot },
];

function AppSidebar({ hideDashboard }: { hideDashboard?: boolean }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const filteredNavItems = hideDashboard 
    ? navItems.filter(item => item.title !== "Dashboard")
    : navItems;

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#1a0533]">
      <div className={`flex h-16 items-center border-0 ${collapsed ? "justify-center" : "gap-2 px-4"}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary text-white">
          <Zap className="h-4 w-4" />
        </div>
        {!collapsed && <span className="text-base font-bold text-sidebar-foreground ml-2">ProspectAI</span>}
      </div>
      <SidebarContent className={`${collapsed ? "px-0" : "px-2"} pt-4`}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={`flex items-center rounded-lg py-2 text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        collapsed ? "justify-center w-full" : "gap-3 px-3 w-full"
                      }`}
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const DashboardLayout = ({ children, onBack, hideDashboard }: { children: ReactNode; onBack?: () => void; hideDashboard?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ firstName: "Freelance", lastName: "", email: "", photo: null as string | null });

  useEffect(() => {
    const firstName = localStorage.getItem("user_firstName");
    const lastName = localStorage.getItem("user_lastName");
    const email = localStorage.getItem("user_email");
    const photo = localStorage.getItem("user_photo");
    if (firstName || email) {
      setUser({ 
        firstName: firstName || "Freelance", 
        lastName: lastName || "", 
        email: email || "fidelleallode0@gmail.com", 
        photo 
      });
    }
  }, []);

  const handleLogout = () => {
    const toastId = toast.loading("Déconnexion en cours...");
    // On ne supprime plus les données du localStorage pour conserver les paramètres
    setTimeout(() => {
      toast.success("Déconnecté", { id: toastId });
      navigate("/");
    }, 1000);
  };

  const initials = (user.firstName[0] + (user.lastName[0] || "")).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex md:min-h-screen w-full fixed inset-0 md:relative overflow-hidden md:overflow-visible">
        <AppSidebar hideDashboard={hideDashboard} />
        <div className="flex flex-1 flex-col overflow-hidden text-white/90">
          {/* Top bar with Glacial Effect and Matching Color */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-0 bg-[#1a0533]/60 backdrop-blur-xl px-4 md:px-6 shrink-0 relative">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hidden md:flex" />
              
              {/* Logo "ProspectAI" sur mobile à gauche */}
              <div className="flex md:hidden items-center gap-1.5">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[14px] font-black tracking-tight text-white hidden sm:block">Prospect<span className="text-[#6366F1]">AI</span></span>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onBack ? onBack() : navigate(-1)}
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl px-4 py-2 h-9 hidden md:flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 border-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-xs font-bold">Retour</span>
              </Button>
            </div>
            
            {/* Bouton Passer PRO centré sur mobile */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <Link to="/pricing">
                <Button size="sm" className="gradient-primary text-primary-foreground border-0 shadow-primary px-3 md:px-4">
                  <Crown className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap md:inline">Passer PRO</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 ring-2 ring-white/10 hover:ring-[#6366F1]/50 transition-all">
                      <AvatarImage src={user.photo || ""} alt={user.firstName} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-xs font-bold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a2e] border-white/10 text-white p-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-white/40">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem className="focus:bg-white/5 cursor-pointer rounded-lg text-red-400 focus:text-red-300" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-24 md:pb-6">{children}</main>

          {/* Bottom Navigation for Mobile - uniquement Messages et Coach IA */}
          <nav className="md:hidden flex items-center justify-around bg-[#1a0533] border-t border-white/5 pb-safe pt-2 px-2 shrink-0 h-[68px] z-50 sticky bottom-0">
            <Link 
              to="/messages"
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full ${location.pathname === '/messages' ? "text-[#6366F1]" : "text-white/40 hover:text-white/80"}`}
            >
              <MessageSquareText className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Messages</span>
            </Link>
            <Link 
              to="/coach"
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full ${location.pathname === '/coach' ? "text-[#6366F1]" : "text-white/40 hover:text-white/80"}`}
            >
              <Bot className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Coach IA</span>
            </Link>
          </nav>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
