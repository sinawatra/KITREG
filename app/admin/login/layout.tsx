import { QueryProvider } from "@/components/query-provider"
import React from "react"

// Separate layout for login page to avoid the redirect loop in the admin layout
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}
