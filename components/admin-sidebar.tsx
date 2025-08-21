"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Users, CalendarPlus, LogOut, CalendarCheck, BarChart3 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabaseClient"
import { useQuery } from "@tanstack/react-query"

interface UserProfile {
  name: string
  is_admin: boolean
}

async function fetchAdminProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("name, is_admin").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching admin profile:", error)
    return null
  }
  return data
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: adminProfile } = useQuery<UserProfile | null, Error>({
    queryKey: ["adminProfile"],
    queryFn: fetchAdminProfile,
  })

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert("Error logging out: " + error.message)
    } else {
      router.push("/admin/login")
    }
  }

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="flex items-center justify-center p-10">
        <Link href="/admin/dashboard" className="text-center">

          <div className=" sidebar-expanded:block text-[#9B0000] font-bold text-sm">ADMIN PANEL</div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/dashboard"}>
                  <Link href="/admin/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Event Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Event Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/admin/dashboard/events") && !pathname.includes("/create")}
                >
                  <Link href="/admin/dashboard/events">
                    <CalendarCheck />
                    <span>All Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/dashboard/events/create"}>
                  <Link href="/admin/dashboard/events/create">
                    <CalendarPlus />
                    <span>Create Event</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Management */}
        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/dashboard/users"}>
                  <Link href="/admin/dashboard/users">
                    <Users />
                    <span>All Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* System */}
        
      </SidebarContent>

      <SidebarFooter className="p-4">

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
