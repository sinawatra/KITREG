import { redirect } from "next/navigation"

export default function DashboardRootPage() {
  // Redirect to the tickets page by default
  redirect("/dashboard/tickets")
}
