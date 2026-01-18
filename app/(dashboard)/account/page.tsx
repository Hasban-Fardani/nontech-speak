import type { Metadata } from "next";
import { AccountSettings } from "@/components/organisms/AccountSettings";

export const metadata: Metadata = {
	title: "Account | NonTechSpeak",
	description: "Manage your account settings",
};

export default function AccountPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Manage your personal information, subscription, and security settings.
				</p>
			</div>

			<div className="max-w-4xl">
				<AccountSettings />
			</div>
		</div>
	);
}
