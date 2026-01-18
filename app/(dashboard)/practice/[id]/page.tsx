"use client";

import { ArrowLeft, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

type Challenge = {
	id: string;
	title: string;
	description: string;
	difficulty: "beginner" | "intermediate" | "expert";
	xpReward: number;
	tags: string[];
	hints: string[];
};

export default function ActivePracticePage() {
	const params = useParams();
	const router = useRouter();
	const [challenge, setChallenge] = React.useState<Challenge | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [input, setInput] = React.useState("");
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		async function fetchChallenge() {
			try {
				const res = await fetch(`/api/practice/challenges/${params.id}`);
				if (res.ok) {
					const data = await res.json();
					setChallenge(data);
				} else {
					toast.error("Challenge not found");
				}
			} catch (error) {
				console.error("Failed to fetch challenge:", error);
				toast.error("Failed to load challenge");
			} finally {
				setLoading(false);
			}
		}

		if (params.id) {
			fetchChallenge();
		}
	}, [params.id]);

	const handleSubmit = async () => {
		if (!challenge || !input.trim()) return;

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/practice/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					challengeId: challenge.id,
					userExplanation: input,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to submit");
			}

			const data = await response.json();
			toast.success(`+${data.xpEarned} XP Earned!`, {
				description: "Great job completing the challenge!",
			});

			// Redirect to the result/history page
			router.push(`/history/practice/${data.practice.id}`);
		} catch (error) {
			console.error("Submit error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to submit answer",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<Skeleton className="h-10 w-32" />
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-32 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!challenge) {
		return (
			<div className="max-w-4xl mx-auto space-y-6 text-center py-20">
				<h2 className="text-2xl font-bold mb-4">Challenge Not Found</h2>
				<Button asChild>
					<Link href="/practice">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Practice List
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Button variant="ghost" asChild>
				<Link href="/practice">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Practice List
				</Link>
			</Button>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">{challenge.title}</h1>
					<div className="flex items-center gap-2 mt-2">
						<Badge
							variant={
								challenge.difficulty === "beginner"
									? "secondary"
									: challenge.difficulty === "intermediate"
										? "default"
										: "destructive"
							}
							className="capitalize"
						>
							{challenge.difficulty}
						</Badge>
						<span className="text-sm text-muted-foreground border-l pl-2 ml-1">
							{challenge.xpReward} XP Reward
						</span>
					</div>
				</div>
			</div>

			<Card className="border-l-4 border-l-primary">
				<CardHeader>
					<CardTitle className="text-lg">Scenario</CardTitle>
					<CardDescription className="text-base text-foreground/90">
						{challenge.description}
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Hints Section */}
			{challenge.hints && challenge.hints.length > 0 && (
				<div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md border">
					<details className="group">
						<summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground w-fit">
							<Sparkles className="h-4 w-4" />
							<span className="group-open:hidden">Show Hint</span>
							<span className="hidden group-open:inline">Hide Hint</span>
						</summary>
						<div className="mt-2 text-sm text-muted-foreground animated fadeIn pl-6">
							<ul className="list-disc list-inside space-y-1">
								{challenge.hints.map((hint, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Static hints
									<li key={i}>{hint}</li>
								))}
							</ul>
						</div>
					</details>
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Your Explanation</CardTitle>
					<CardDescription>
						Explain this concept simply, as if to a non-technical person.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Textarea
						placeholder="Type your explanation here..."
						className="min-h-[200px] resize-none p-4 text-base"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
				</CardContent>
				<CardFooter className="flex justify-end gap-2">
					<Button
						onClick={handleSubmit}
						disabled={!input.trim() || isSubmitting}
						size="lg"
						className="min-w-[150px]"
					>
						{isSubmitting ? (
							"Grading..."
						) : (
							<>
								Submit Answer <Send className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">Pro Tips</CardTitle>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground space-y-1">
					<p>• Use analogies from everyday life (cooking, driving, etc.)</p>
					<p>• Avoid using acronyms without defining them</p>
					<p>• Keep sentences short and punchy</p>
				</CardContent>
			</Card>
		</div>
	);
}
