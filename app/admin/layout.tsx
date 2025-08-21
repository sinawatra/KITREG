import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { QueryProvider } from "@/components/query-provider"
import { createServerSupabaseClient } from "@/lib/serverUtils"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // We don't need to check for login page since it has its own layout now
  try {
    const supabaseServer = await createServerSupabaseClient();
    const { data: { session } } = await supabaseServer.auth.getSession();
    
    if (!session) {
      redirect("/admin/login"); // Redirect unauthenticated users to admin login
    }
    
    // Check if the logged-in user is an admin
    const { data: profile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();
      
    if (profileError || !profile?.is_admin) {
      // If not an admin, sign them out and redirect to admin login
      await supabaseServer.auth.signOut();
      redirect("/admin/login?error=unauthorized");
    }
    
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("admin-sidebar:state")?.value === "true"
  
    return (
      <QueryProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AdminSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </QueryProvider>
    );
  } catch (error) {
    console.error("Admin layout error:", error);
    redirect("/admin/login");
    return null; // This will never be reached, but TypeScript needs it
  }
}
