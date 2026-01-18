"use client";

import {
	Dumbbell,
	History as HistoryIcon,
	LayoutDashboard,
	Library,
	MessageSquare,
	Settings,
	Trophy,
	User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/molecules/SignOutButton";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
	{
		title: "Translate",
		url: "/translate",
		icon: MessageSquare,
	},
	{
		title: "Practice",
		url: "/practice",
		icon: Dumbbell,
	},
	{
		title: "History",
		url: "/history",
		icon: HistoryIcon,
	},
	{
		title: "Leaderboard",
		url: "/leaderboard",
		icon: Trophy,
	},
	{
		title: "Examples",
		url: "/examples",
		icon: Library,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
									<Image
										src="/logo/ns-bg-transparant.png"
										alt="Non-Tech Speak Logo"
										width={32}
										height={32}
										className="size-8"
									/>
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">Non-Tech Speak</span>
									<span className="">v1.0.0</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === "/dashboard"}
									tooltip="Dashboard"
								>
									<Link href="/dashboard">
										<LayoutDashboard />
										<span>Dashboard</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.url}
										tooltip={item.title}
									>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem className="hidden md:list-item">
						<SidebarMenuButton
							asChild
							tooltip="Account"
							isActive={pathname === "/account"}
						>
							<Link href="/account">
								<User />
								<span>Account</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SignOutButton />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
