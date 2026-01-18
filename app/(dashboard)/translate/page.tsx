import type { Metadata } from "next";
import { TranslationForm } from "@/components/organisms/TranslationForm";

export const metadata: Metadata = {
	title: "Translate | NonTechSpeak",
	description: "Simpify technical concepts",
};

export default function TranslatePage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Translate</h3>
				<p className="text-sm text-muted-foreground">
					Turn complex tech jargon into simple, easy-to-understand language.
				</p>
			</div>
			<div>
				<TranslationForm />
			</div>
		</div>
	);
}
