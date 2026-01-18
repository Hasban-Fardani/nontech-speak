"use client";

import { ArrowLeft, RefreshCw, Send, Star } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { AudioRecorder } from "@/components/molecules/AudioRecorder";
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
import { Textarea } from "@/components/ui/textarea";

// Mock Data - In real app fetch based on ID
const CHALLENGES = {
	c1: {
		id: "c1",
		title: "Explain 'API' to a Grandparent",
		description:
			"Goal: Explain how software talks to software without using jargon. Use an everyday analogy.",
		difficulty: "Beginner",
		xp: 50,
		tags: ["System Design", "Web"],
		hints: [
			"Think about a restaurant scenario.",
			"You (the customer) don't go into the kitchen (the server).",
			"Someone takes your order and brings the food back.",
		],
	},
	// Fallback for demo
	default: {
		id: "xx",
		title: "Standard Challenge",
		description: "Goal: Explain a complex topic simply.",
		difficulty: "Intermediate",
		xp: 75,
		tags: ["General"],
		hints: ["Try to relate it to something physical.", "Avoid using acronyms."],
	},
};

type Feedback = {
	score: number;
	explanation: string;
	strengths: string[];
	improvements: string[];
};

export default function PracticeDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// Unwrap params
	const { id } = use(params);
	const challenge =
		CHALLENGES[id as keyof typeof CHALLENGES] || CHALLENGES.default;

	const [input, setInput] = useState("");
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState<Feedback | null>(null);

	const handleSubmit = () => {
		setIsSubmitting(true);
		setTimeout(() => {
			setFeedback({
				score: 85,
				explanation:
					"Great analogy! You effectively communicated the core concept.",
				strengths: ["Clear analogy", "Friendly tone"],
				improvements: ["Could be more concise"],
			});
			setIsSubmitting(false);
		}, 1500);
	};

	const handleRetry = () => {
		setFeedback(null);
		setInput("");
		setAudioBlob(null);
	};

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
								challenge.difficulty === "Beginner"
									? "secondary"
									: challenge.difficulty === "Intermediate"
										? "default"
										: "destructive"
							}
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
							{challenge.xp} XP
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
							<div className="relative py-2">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or record audio
									</span>
								</div>
							</div>
							<AudioRecorder onRecordingComplete={setAudioBlob} />
						</CardContent>
						<CardFooter className="flex justify-end">
							<Button
								onClick={handleSubmit}
								disabled={(!input && !audioBlob) || isSubmitting}
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
										{feedback.strengths.map((s) => (
											<li key={s}>{s}</li>
										))}
									</ul>
								</div>
								<div>
									<h4 className="text-sm font-semibold text-amber-600 mb-1">
										Improvements
									</h4>
									<ul className="text-sm list-disc list-inside text-muted-foreground">
										{feedback.improvements.map((s) => (
											<li key={s}>{s}</li>
										))}
									</ul>
								</div>
							</div>
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
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
