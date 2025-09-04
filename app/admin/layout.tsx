import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { QueryProvider } from "@/components/query-provider"
import { createServerSupabaseClient } from "@/lib/serverUtils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple layout that just provides QueryProvider
  // Authentication is handled by individual pages or middleware
  // The login page has its own layout, other admin pages should handle auth themselves
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
