import type { Metadata } from "next";
import { SettingsForm } from "@/components/organisms/SettingsForm";

export const metadata: Metadata = {
	title: "Settings | NonTechSpeak",
	description: "Configure your application preferences",
};

export default function SettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Settings</h3>
				<p className="text-sm text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>
			<div className="max-w-4xl">
				<SettingsForm />
			</div>
		</div>
	);
}
