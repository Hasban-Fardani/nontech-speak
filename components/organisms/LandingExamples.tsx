"use client";

import { Library, ArrowRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { ExampleCard } from "@/components/molecules/ExampleCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Example = {
	id: string;
	technicalText: string;
	simplifiedText: string;
	audienceType: string;
	upvotesCount: number;
	viewCount: number;
	createdAt: string;
	aiModel?: string | null;
	user?: {
		name: string | null;
		image: string | null;
	};
};

export function LandingExamples() {
	const [examples, setExamples] = React.useState<Example[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchExamples() {
			try {
				const response = await fetch("/api/public/feed?limit=6");
				if (!response.ok) throw new Error("Failed to fetch");
				const data = await response.json();
				setExamples(data);
			} catch (error) {
				console.error("Failed to fetch examples:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchExamples();
	}, []);

	if (loading) {
		return (
			<section className="w-full py-12 md:py-24">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Community Examples
						</h2>
						<p className="mx-auto max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400 mt-4">
							Learn from the best explanations shared by our community.
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{[...Array(3)].map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static
							<Skeleton key={i} className="h-64 rounded-xl" />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (examples.length === 0) return null;

	return (
		<section className="w-full py-12 md:py-24">
			<div className="container px-4 md:px-6 mx-auto">
				<div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
					<div className="space-y-2">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80 dark:bg-indigo-900/30 dark:text-indigo-400 mb-4">
							<Library className="w-3 h-3 mr-1" />
							Examples Library
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							See It in Action
						</h2>
						<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
							Browse real-world examples of technical concepts simplified for different audiences.
						</p>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
					{examples.map((ex) => (
						<ExampleCard
							key={ex.id}
							id={ex.id}
							title={ex.technicalText}
							description={ex.simplifiedText}
							tags={[ex.audienceType, ex.aiModel || "AI"]}
							initialUpvotes={ex.upvotesCount}
							content={ex.simplifiedText}
							href={`/examples/${ex.id}`} // Links to detail page (might be protected or pub?)
						/>
					))}
				</div>

                <div className="flex justify-center">
                    <Link href="/examples">
                         <Button size="lg" className="h-12 px-8 rounded-full text-base">
                            View More Examples <ArrowRight className="ml-2 h-4 w-4" />
                         </Button>
                    </Link>
                </div>
			</div>
		</section>
	);
}
