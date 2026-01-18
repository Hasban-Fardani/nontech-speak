import { AppSidebar } from "@/components/organisms/AppSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { auth } from "@/server/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" /> {/* Separator manual replacement */}
            <span className="font-semibold">Translation Studio</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
