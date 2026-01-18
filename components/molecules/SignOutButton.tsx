"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully", {
              description: "See you next time!"
            })
            router.push("/login")
          },
          onError: () => {
            toast.error("Failed to logout", {
              description: "Please try again."
            })
          },
        },
      })
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again."
      })
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
