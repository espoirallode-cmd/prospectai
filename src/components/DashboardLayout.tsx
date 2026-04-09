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
    localStorage.removeItem("user_firstName");
    localStorage.removeItem("user_lastName");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_photo");
    setTimeout(() => {
      toast.success("Déconnecté", { id: toastId });
      navigate("/");
    }, 1000);
  };

  const initials = (user.firstName[0] + (user.lastName[0] || "")).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar hideDashboard={hideDashboard} />
        <div className="flex flex-1 flex-col">
          {/* Top bar with Glacial Effect and Matching Color */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-0 bg-[#1a0533]/60 backdrop-blur-xl px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onBack ? onBack() : navigate(-1)}
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl px-4 py-2 h-9 flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 border-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-xs font-bold">Retour</span>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/pricing">
                <Button size="sm" className="gradient-primary text-primary-foreground border-0 shadow-primary">
                  <Crown className="mr-1.5 h-3.5 w-3.5" />
                  Passer PRO
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              </Button>
              
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
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
