"use client";

import { Calendar, MessageSquare, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PracticeHistory = {
	id: string;
	challengePrompt: string;
	score: number;
	feedbackText: string;
	suggestions: string[];
	createdAt: string;
};

type TranslationHistory = {
	id: string;
	technicalText: string;
	simplifiedText: string;
	audienceType: string;
	createdAt: string;
	isPublic: boolean;
};

export default function HistoryPage() {
	const [practiceHistory, setPracticeHistory] = React.useState<
		PracticeHistory[]
	>([]);
	const [translationHistory, setTranslationHistory] = React.useState<
		TranslationHistory[]
	>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchHistory() {
			try {
				const [practiceRes, translationRes] = await Promise.all([
					fetch("/api/practice/history"),
					fetch("/api/translation/list?limit=50"),
				]);

				if (practiceRes.ok) {
					const practiceData = await practiceRes.json();
					setPracticeHistory(practiceData);
				}

				if (translationRes.ok) {
					const translationData = await translationRes.json();
					setTranslationHistory(translationData);
				}
			} catch (error) {
				console.error("Failed to fetch history:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchHistory();
	}, []);

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
			<div className="space-y-6">
				<div>
					<h3 className="text-lg font-medium">History</h3>
					<p className="text-sm text-muted-foreground">
						Your past translations and practice attempts.
					</p>
				</div>

				<div className="grid gap-4">
					{[...Array(3)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-5 w-3/4 mb-2" />
								<Skeleton className="h-4 w-1/2" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-16 w-full" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">History</h3>
				<p className="text-sm text-muted-foreground">
					Your past translations and practice attempts.
				</p>
			</div>

			<Tabs defaultValue="practice" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="practice" className="gap-2">
						<Target className="h-4 w-4" />
						Practice ({practiceHistory.length})
					</TabsTrigger>
					<TabsTrigger value="translations" className="gap-2">
						<Sparkles className="h-4 w-4" />
						Translations ({translationHistory.length})
					</TabsTrigger>
				</TabsList>

				{/* Practice History Tab */}
				<TabsContent value="practice" className="space-y-4 mt-6">
					{practiceHistory.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Target className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									No Practice History
								</h3>
								<p className="text-sm text-muted-foreground text-center mb-4">
									You haven't completed any practice challenges yet.
								</p>
								<Link
									href="/practice"
									className="text-sm text-primary hover:underline"
								>
									Start practicing →
								</Link>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4">
							{practiceHistory.map((item) => (
								<Link key={item.id} href={`/history/practice/${item.id}`}>
									<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
										<CardHeader>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<CardTitle className="text-base">
														{item.challengePrompt || "Practice Challenge"}
													</CardTitle>
													<CardDescription className="flex items-center gap-2 mt-1">
														<Calendar className="h-3 w-3" />
														{new Date(item.createdAt).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															},
														)}
													</CardDescription>
												</div>
												<Badge variant={getScoreBadge(item.score)}>
													<span
														className={`font-bold ${getScoreColor(item.score)}`}
													>
														{item.score}/100
													</span>
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground line-clamp-2">
												{item.feedbackText}
											</p>
											{item.suggestions && item.suggestions.length > 0 && (
												<div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
													<Target className="h-3 w-3" />
													{item.suggestions.length} improvement
													{item.suggestions.length !== 1 ? "s" : ""} suggested
												</div>
											)}
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					)}
				</TabsContent>

				{/* Translation History Tab */}
				<TabsContent value="translations" className="space-y-4 mt-6">
					{translationHistory.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									No Translation History
								</h3>
								<p className="text-sm text-muted-foreground text-center mb-4">
									You haven't created any translations yet.
								</p>
								<Link
									href="/translate"
									className="text-sm text-primary hover:underline"
								>
									Start translating →
								</Link>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4">
							{translationHistory.map((item) => (
								<Link key={item.id} href={`/history/translation/${item.id}`}>
									<Card className="hover:bg-accent/50 transition-colors cursor-pointer">
										<CardHeader>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<CardTitle className="text-base line-clamp-1">
														{item.technicalText}
													</CardTitle>
													<CardDescription className="flex items-center gap-2 mt-1">
														<Calendar className="h-3 w-3" />
														{new Date(item.createdAt).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															},
														)}
													</CardDescription>
												</div>
												<Badge variant="outline" className="capitalize">
													{item.audienceType}
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground line-clamp-2">
												{item.simplifiedText}
											</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
