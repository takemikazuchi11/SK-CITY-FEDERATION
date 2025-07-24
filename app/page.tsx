import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard immediately without any authentication checks
  redirect("/dashboard")
}
