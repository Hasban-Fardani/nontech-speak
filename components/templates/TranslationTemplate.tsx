import { TranslationForm } from "@/components/organisms/TranslationForm";

export function TranslationTemplate() {
	return (
		<div className="w-full space-y-8">
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Technical Translator
				</h1>
				<p className="text-muted-foreground">
					Convert complex technical documentation into simple analogies.
				</p>
			</div>

			<TranslationForm />
		</div>
	);
}
