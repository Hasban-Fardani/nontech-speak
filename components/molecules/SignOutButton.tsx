"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						toast.success("Logged out successfully", {
							description: "See you next time!",
						});
						router.push("/login");
					},
					onError: () => {
						toast.error("Failed to logout", {
							description: "Please try again.",
						});
					},
				},
			});
		} catch (_error) {
			toast.error("An error occurred", {
				description: "Please try again.",
			});
		}
	};

	return (
		<SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
			<LogOut />
			<span>Sign Out</span>
		</SidebarMenuButton>
	);
}
