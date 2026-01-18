import type { Metadata } from "next";
import { HistoryDetail } from "@/components/organisms/HistoryDetail";

export const metadata: Metadata = {
	title: "Translation Details | NonTechSpeak",
	description: "View details of your translation",
};

export default async function HistoryDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <HistoryDetail id={id} />;
}
