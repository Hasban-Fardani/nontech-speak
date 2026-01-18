"use client";

import { ArrowLeft, RefreshCw, Send, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
	difficulty: string;
	xpReward: number;
	tags: string[];
	hints: string[];
};

type Feedback = {
	score: number;
	explanation: string;
	strengths: string[];
	improvements: string[];
};

export default function PracticeDetailPage() {
	const params = useParams();
	const id = params.id as string;

	const [challenge, setChallenge] = React.useState<Challenge | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [input, setInput] = React.useState("");
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [feedback, setFeedback] = React.useState<Feedback | null>(null);
	const [xpEarned, setXpEarned] = React.useState(0);

	React.useEffect(() => {
		async function fetchChallenge() {
			try {
				const response = await fetch("/api/practice/challenges");
				if (!response.ok) throw new Error("Failed to fetch");
				const challenges = await response.json();
				const found = challenges.find((c: Challenge) => c.id === id);
				setChallenge(found || null);
			} catch (error) {
				console.error("Failed to fetch challenge:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchChallenge();
	}, [id]);

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
				throw new Error("Failed to submit");
			}

			const data = await response.json();
			setFeedback(data.feedback);
			setXpEarned(data.xpEarned);
			toast.success(`+${data.xpEarned} XP earned!`);
		} catch (_error) {
			toast.error("Failed to submit. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRetry = () => {
		setFeedback(null);
		setInput("");
		setXpEarned(0);
	};

	if (loading) {
		return (
			<div className="space-y-8">
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	if (!challenge) {
		return (
			<div className="text-center py-20">
				<h2 className="text-2xl font-bold mb-4">Challenge Not Found</h2>
				<Button asChild>
					<Link href="/practice">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Practice
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/practice">
						<ArrowLeft className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						{challenge.title}
					</h1>
					<div className="flex items-center gap-2 mt-1">
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
						{challenge.tags.map((tag) => (
							<Badge
								key={tag}
								variant="outline"
								className="text-xs font-normal"
							>
								{tag}
							</Badge>
						))}
						<span className="text-sm text-muted-foreground border-l pl-2 ml-1">
							{challenge.xpReward} XP
						</span>
					</div>
				</div>
			</div>

			<div className="grid gap-8 md:grid-cols-3">
				<Card className="md:col-span-3 border-l-4 border-l-primary">
					<CardHeader>
						<CardTitle className="text-lg">Scenario</CardTitle>
						<CardDescription className="text-base">
							{challenge.description}
						</CardDescription>
					</CardHeader>
				</Card>

				{/* Hints Section */}
				<div className="md:col-span-3">
					<details className="group">
						<summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground w-fit">
							<span className="group-open:hidden">Show Hint</span>
							<span className="hidden group-open:inline">Hide Hint</span>
						</summary>
						<div className="mt-2 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md border animated fadeIn">
							<ul className="list-disc list-inside space-y-1">
								{challenge.hints.map((hint) => (
									<li key={hint}>{hint}</li>
								))}
							</ul>
						</div>
					</details>
				</div>

				{!feedback ? (
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle>Your Answer</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Textarea
								placeholder="Type your explanation..."
								className="min-h-[200px] resize-none p-4"
								value={input}
								onChange={(e) => setInput(e.target.value)}
							/>
						</CardContent>
						<CardFooter className="flex justify-end">
							<Button
								onClick={handleSubmit}
								disabled={!input.trim() || isSubmitting}
								size="lg"
							>
								{isSubmitting ? (
									"Grading..."
								) : (
									<>
										<span className="mr-2">Submit</span>{" "}
										<Send className="h-4 w-4" />
									</>
								)}
							</Button>
						</CardFooter>
					</Card>
				) : (
					<Card className="md:col-span-2 border-green-200 dark:border-green-900 bg-green-50/10">
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle>Feedback</CardTitle>
								<Badge
									variant={feedback.score >= 80 ? "default" : "secondary"}
									className="text-lg px-3"
								>
									<Star className="h-4 w-4 mr-1 fill-current" />{" "}
									{feedback.score}/100
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm">{feedback.explanation}</p>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="text-sm font-semibold text-green-600 mb-1">
										Strengths
									</h4>
									<ul className="text-sm list-disc list-inside text-muted-foreground">
										{feedback.strengths?.map((s) => (
											<li key={s}>{s}</li>
										))}
									</ul>
								</div>
								<div>
									<h4 className="text-sm font-semibold text-amber-600 mb-1">
										Improvements
									</h4>
									<ul className="text-sm list-disc list-inside text-muted-foreground">
										{feedback.improvements?.map((s) => (
											<li key={s}>{s}</li>
										))}
									</ul>
								</div>
							</div>
							{xpEarned > 0 && (
								<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
									<Trophy className="h-5 w-5 text-yellow-500 inline mr-2" />
									<span className="font-bold text-yellow-700 dark:text-yellow-400">
										+{xpEarned} XP Earned!
									</span>
								</div>
							)}
						</CardContent>
						<CardFooter>
							<Button
								onClick={handleRetry}
								variant="outline"
								className="w-full"
							>
								<RefreshCw className="mr-2 h-4 w-4" /> Try Again
							</Button>
						</CardFooter>
					</Card>
				)}

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Tips</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-2">
							<p>• Keep it simple.</p>
							<p>• Use relatable analogies.</p>
							<p>• Avoid jargon.</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
