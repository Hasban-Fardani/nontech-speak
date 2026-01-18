import { ArrowLeft, Quote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { TextToSpeech } from "@/components/molecules/TextToSpeech";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

// In a real app, this would be async because of the DB call
// But for now we just return a component
export const metadata: Metadata = {
	title: "Shared Translation | NonTechSpeak",
	description: "A simplified explanation shared via NonTechSpeak.",
};

// Mock data generator for the demo
function getMockData(_id: string) {
	return {
		originalText:
			"The Kubernetes control plane manages the worker nodes and the Pods in the cluster. In production, the control plane usually runs across multiple computers and a cluster usually runs multiple nodes, providing fault-tolerance and high availability.",
		translatedText:
			"Think of Kubernetes like a manager in a big restaurant (the cluster). The 'control plane' is the head chef and the managers who make all the important decisions. \n\nThey tell the other cooks and staff (worker nodes) what to do and make sure there are enough people to handle the orders (Pods/containers). \n\nIn a busy restaurant (production), you wouldn't just have one manager. You'd have a team of them working together, so if one gets sick or goes on break, the restaurant keeps running smoothly (fault-tolerance/high availability).",
		audience: "Partner",
	};
}

export default function SharePage({ params }: { params: { id: string } }) {
	const data = getMockData(params.id);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
			{/* Header */}
			<header className="border-b bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
						N
					</div>
					<span className="font-semibold text-lg">Non-Tech Speak</span>
				</div>
				<Link href="/login">
					<Button variant="ghost">Sign In</Button>
				</Link>
			</header>

			{/* Main Content */}
			<main className="flex-1 container max-w-3xl mx-auto p-6 flex flex-col items-center justify-center space-y-8">
				<div className="text-center space-y-2">
					<span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
						Shared Translation
					</span>
					<h1 className="text-3xl font-bold tracking-tight">
						Simplified Explanation
					</h1>
					<p className="text-muted-foreground">
						Someone shared this simplified technical concept with you.
					</p>
				</div>

				<div className="grid gap-6 w-full">
					{/* Result Card */}
					<Card className="border-2 border-primary/10 shadow-lg">
						<CardHeader className="bg-primary/5 pb-8">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-primary font-medium">
									<Quote className="h-4 w-4 rotate-180" />
									Simplified for a {data.audience}
								</div>
								<TextToSpeech text={data.translatedText} />
							</div>
						</CardHeader>
						<CardContent className="-mt-4">
							<div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border">
								<p className="text-lg leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-100">
									{data.translatedText}
								</p>
							</div>
						</CardContent>
						<CardFooter className="justify-between text-sm text-muted-foreground pt-0">
							<span>ID: {params.id}</span>
						</CardFooter>
					</Card>

					{/* Original Text (Collapsed/Secondary) */}
					<div className="rounded-lg border bg-muted/50 p-4">
						<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
							Original Technical Text
						</h4>
						<p className="text-sm text-muted-foreground italic">
							"{data.originalText}"
						</p>
					</div>
				</div>

				<Link href="/">
					<Button className="mt-4" size="lg">
						Translate Your Own Content
						<ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
					</Button>
				</Link>
			</main>

			{/* Footer */}
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} Non-Tech Speak. All rights reserved.
			</footer>
		</div>
	);
}
