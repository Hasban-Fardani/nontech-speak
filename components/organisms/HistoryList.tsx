"use client";

import { format } from "date-fns";
import { ArrowRight, Calendar, Eye, Lock, Sparkles } from "lucide-react";
import * as React from "react";
import { ShareButton } from "@/components/molecules/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type HistoryItem = {
	id: string;
	technicalText: string;
	simplifiedText: string;
	audienceType: "parent" | "partner" | "friend" | "child" | "boss";
	createdAt: string;
	isPublic: boolean;
	aiModel?: string | null;
};

export function HistoryList() {
	const [history, setHistory] = React.useState<HistoryItem[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		async function fetchHistory() {
			try {
				const response = await fetch("/api/translation/list?limit=50");
				if (!response.ok) {
					throw new Error("Failed to fetch history");
				}
				const data = await response.json();
				setHistory(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		}

		fetchHistory();
	}, []);

	if (loading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-4 w-20 mb-2" />
							<Skeleton className="h-6 w-full" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-20 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-destructive">Error: {error}</p>
			</div>
		);
	}

	if (history.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					No translations yet. Start by creating your first translation!
				</p>
				<Button asChild className="mt-4">
					<a href="/translate">Create Translation</a>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Tabs defaultValue="translations" className="w-full">
				<TabsList className="grid w-full grid-cols-2 max-w-[400px]">
					<TabsTrigger value="translations">Translations</TabsTrigger>
					<TabsTrigger value="practice">Practice</TabsTrigger>
				</TabsList>

				<TabsContent value="translations" className="mt-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{history.map((item) => (
							<Card
								key={item.id}
								className="flex flex-col h-full hover:shadow-md transition-shadow"
							>
								<CardHeader className="pb-3">
									<div className="flex justify-between items-start mb-2">
										<Badge variant="outline" className="capitalize">
											{item.audienceType}
										</Badge>
										<div className="flex items-center text-xs text-muted-foreground gap-3">
											<div
												className="flex items-center"
												title={item.isPublic ? "Public" : "Private"}
											>
												{item.isPublic ? (
													<Eye className="h-3 w-3 mr-1" />
												) : (
													<Lock className="h-3 w-3 mr-1" />
												)}
											</div>
											<div className="flex items-center">
												<Calendar className="mr-1 h-3 w-3" />
												{format(new Date(item.createdAt), "MMM d, yyyy")}
											</div>
										</div>
									</div>
									<CardTitle className="text-base line-clamp-2 leading-tight">
										{item.technicalText}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex-1 pb-3">
									<div className="text-sm text-muted-foreground line-clamp-4">
										<div className="flex items-center gap-2 mb-2 text-primary/80 font-medium">
											<Sparkles className="h-3 w-3" />
											<span>Simplified:</span>
										</div>
										{item.simplifiedText}
									</div>
								</CardContent>
								<CardFooter className="pt-3 border-t bg-slate-50 dark:bg-slate-900/50 flex gap-2">
									<Button
										asChild
										variant="ghost"
										size="sm"
										className="flex-1 text-xs hover:bg-transparent hover:text-primary"
									>
										<a href={`/history/${item.id}`}>
											View Details <ArrowRight className="ml-2 h-3 w-3" />
										</a>
									</Button>
									<ShareButton
										id={item.id}
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-muted-foreground"
									/>
								</CardFooter>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="practice" className="mt-6">
					<div className="text-center py-12">
						<p className="text-muted-foreground">
							Practice history coming soon!
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
