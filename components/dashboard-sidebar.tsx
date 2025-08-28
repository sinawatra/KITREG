"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Bell, Ticket, User2, LogOut, Home } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabaseClient"
import { useQuery, useQueryClient } from "@tanstack/react-query"

interface UserProfile {
  name: string
  is_admin: string | boolean
  department: string
}

async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("name, is_admin, department")
      .eq("id", user.id)
      .single();

    if (error) console.error("Error fetching profile:", error);

    return {
      name: data?.name ?? user.email?.split("@")[0] ?? "User",
      is_admin: data?.is_admin ?? true,
      department: data?.department ?? ""
    };
  } catch (err) {
    console.error("Unexpected error fetching profile:", err);
    return null;
  }
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: userProfile } = useQuery<UserProfile | null, Error>({
    queryKey: ["dashboardUserProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error logging out:", error)
        alert("Error logging out: " + error.message)
      } else {
        queryClient.clear() // Clear all queries
        router.push("/")
      }
    } catch (error) {
      console.error("Unexpected error during logout:", error)
    }
  }

  return (
    <Sidebar collapsible="none" className="border-r border-gray-200">
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/dashboard/tickets" className="text-lg font-bold text-[#9B0000]">
          Attendances
        </Link>
        <div className="flex items-center space-x-3">
          {/* User Profile Section */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage
                src="/images/user-avatar.png"
                alt={userProfile?.name || "User"}
                className="rounded-lg object-cover"
              />
              <AvatarFallback className="rounded-lg bg-blue-500 text-white">
                {userProfile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left hidden md:block">
              <div className="text-sm font-semibold text-gray-800">{userProfile?.name || "User"}</div>
              <div className="text-xs text-gray-500">{userProfile?.is_admin ? "Admin" : "User"}</div>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {/* Home Page Link */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/"} 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full hover:bg-gray-100"
                >
                  <Link href="/" className="flex items-center w-full">
                    <Home className="h-5 w-5 mr-3" />
                    <span className="font-medium">Home Page</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/dashboard/tickets"}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full hover:bg-gray-100"
                >
                  <Link href="/dashboard/tickets" className="flex items-center w-full">
                    <Ticket className="h-5 w-5 mr-3" />
                    <span className="font-medium">Tickets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/dashboard/profile"}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md w-full hover:bg-gray-100"
                >
                  <Link href="/dashboard/profile" className="flex items-center w-full">
                    <User2 className="h-5 w-5 mr-3" />
                    <span className="font-medium">Profile Details</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="flex-grow"></div>
      
      <SidebarFooter className="p-3 border-t border-gray-200 mt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 transition-colors rounded-md w-full"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
