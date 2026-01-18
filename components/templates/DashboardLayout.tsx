import React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      {sidebar}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <div className="w-px h-4 bg-border mx-2" />
          <span className="font-semibold">Translation Studio</span>
        </header>
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
