import { User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/molecules/ModeToggle";
import { AppSidebar } from "@/components/organisms/AppSidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex flex-1 items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<span className="font-semibold">Translation Studio</span>
					</div>

					<div className="flex items-center gap-2 px-4">
						<ModeToggle />
						<Link
							href="/account"
							className="flex items-center justify-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
						>
							<User className="h-5 w-5" />
							<span className="sr-only">Account</span>
						</Link>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
