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
import { Bell, Ticket, User2, LogOut } from "lucide-react"
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
    <Sidebar collapsible="none">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard/tickets" className="text-lg font-bold text-[#9B0000]">
          Attendances
        </Link>
        <div className="flex items-center space-x-3">
          {/* Notification Bell
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              2
            </span>
          </Button> */}

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
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem className="py-2">
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/tickets"}>
                  <Link href="/dashboard/tickets">
                    <Ticket />
                    <span>Ticket</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/profile"}>
                  <Link href="/dashboard/profile">
                    <User2 />
                    <span>Profile Details</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
