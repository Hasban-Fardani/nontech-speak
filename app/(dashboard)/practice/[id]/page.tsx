"use client";

import {
	ArrowLeft,
	Calendar,
	CheckCircle2,
	Lightbulb,
	RefreshCw,
	Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
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

type PracticeDetail = {
	id: string;
	userId: string;
	userInput: string;
	challengePrompt: string;
	score: number;
	feedbackText: string;
	suggestions: string[];
	createdAt: string;
};

export default function PracticeHistoryDetailPage() {
	const params = useParams();
	// router unused
	const [practice, setPractice] = React.useState<PracticeDetail | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		async function fetchPractice() {
			try {
				const res = await fetch(`/api/practice/${params.id}`);
				if (res.ok) {
					const data = await res.json();
					setPractice(data);
				} else {
					setError("Failed to load practice details");
				}
			} catch (error) {
				console.error("Failed to fetch practice:", error);
				setError("Failed to load practice details");
			} finally {
				setLoading(false);
			}
		}

		if (params.id) {
			fetchPractice();
		}
	}, [params.id]);

	const getScoreColor = (score: number) => {
		if (score >= 80) return "text-green-600 dark:text-green-400";
		if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
		return "text-white";
	};

	const getScoreBadge = (score: number) => {
		if (score >= 80) return "default";
		if (score >= 60) return "secondary";
		return "destructive";
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
					<CardContent className="space-y-4">
						<Skeleton className="h-24 w-full" />
						<Skeleton className="h-32 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !practice) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<Button variant="ghost" asChild>
					<Link href="/history">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to History
					</Link>
				</Button>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<p className="text-sm text-muted-foreground">
							{error || "Practice not found"}
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Parse suggestions if it's a string array
	const improvements =
		typeof practice.suggestions === "string" ? [] : practice.suggestions || [];

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Button variant="ghost" asChild>
				<Link href="/history">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to History
				</Link>
			</Button>

			{/* Challenge Info */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<CardTitle>
								{practice.challengePrompt || "Practice Challenge"}
							</CardTitle>
							<CardDescription className="flex items-center gap-2 mt-2">
								<Calendar className="h-4 w-4" />
								{new Date(practice.createdAt).toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</CardDescription>
						</div>
						<Badge variant={getScoreBadge(practice.score)} className="text-lg">
							<Trophy className={`mr-2 h-4 w-4 ${getScoreColor(practice.score)}`} />
							<span className={`font-bold ${getScoreColor(practice.score)}`}>
								{practice.score}/100
							</span>
						</Badge>
					</div>
				</CardHeader>
			</Card>

			{/* Your Explanation */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Your Explanation</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm whitespace-pre-wrap">{practice.userInput}</p>
				</CardContent>
			</Card>

			{/* AI Feedback */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">AI Feedback</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm">{practice.feedbackText}</p>

					{improvements.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
								Suggestions for Improvement
							</div>
							<ul className="space-y-2">
								{improvements.map((improvement, idx) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: List is static strings
									<li key={idx} className="flex items-start gap-2 text-sm">
										<CheckCircle2 className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
										<span>{improvement}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</CardContent>
				<CardFooter>
					<Button variant="outline" className="w-full" asChild>
						<Link href="/practice">
							<RefreshCw className="mr-2 h-4 w-4" />
							Try More Challenges
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
