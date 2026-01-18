import type { Metadata } from "next";
import { HistoryList } from "@/components/organisms/HistoryList";

export const metadata: Metadata = {
	title: "History | NonTechSpeak",
	description: "View your past translations",
};

export default function HistoryPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">History</h3>
				<p className="text-sm text-muted-foreground">
					Your past translations and simplified explanations.
				</p>
			</div>

			<HistoryList />
		</div>
	);
}
