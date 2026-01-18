"use client";

import { Crown } from "lucide-react";
import * as React from "react";
import { LeaderboardItem, type LeaderboardEntry } from "@/components/molecules/LeaderboardItem";
import { PublicHeader } from "@/components/organisms/PublicHeader";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RankingsPage() {
	const [period, setPeriod] = React.useState("all_time");
	const [data, setData] = React.useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchLeaderboard() {
			setLoading(true);
			try {
				const res = await fetch(`/api/leaderboard?period=${period}`);
				if (res.ok) {
					const leaderboard = await res.json();
					setData(leaderboard);
				}
			} catch (error) {
				console.error("Failed to fetch leaderboard:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchLeaderboard();
	}, [period]);

	return (
		<div className="flex flex-col min-h-screen">
			<PublicHeader />

			<main className="flex-1 py-12 container mx-auto px-4 md:px-6">
				<div className="space-y-8 max-w-4xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Global Leaderboard
							</h1>
							<p className="text-muted-foreground mt-1">
								Top contributors making tech accessible to everyone.
							</p>
						</div>
						<div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-900">
							<Crown className="h-5 w-5" />
							<span className="font-bold">Season 1</span>
						</div>
					</div>

					<Tabs value={period} onValueChange={setPeriod} className="w-full">
						<TabsList className="grid w-full grid-cols-4 max-w-[600px]">
							<TabsTrigger value="today">Today</TabsTrigger>
							<TabsTrigger value="week">This Week</TabsTrigger>
							<TabsTrigger value="month">This Month</TabsTrigger>
							<TabsTrigger value="all_time">All Time</TabsTrigger>
						</TabsList>
					</Tabs>

					{loading ? (
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-32 mb-2" />
								<Skeleton className="h-4 w-48" />
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[...Array(10)].map((_, i) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static
											key={i}
											className="flex items-center justify-between p-4 rounded-lg border"
										>
											<div className="flex items-center gap-4">
												<Skeleton className="h-8 w-8 rounded-full" />
												<Skeleton className="h-10 w-10 rounded-full" />
												<div>
													<Skeleton className="h-4 w-24 mb-2" />
													<Skeleton className="h-3 w-16" />
												</div>
											</div>
											<Skeleton className="h-6 w-20" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardHeader>
								<CardTitle>Rankings</CardTitle>
								<CardDescription>
									Top contributors for this period.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{data.length === 0 ? (
									<div className="text-center py-12 text-muted-foreground">
										<p>No rankings available for this period.</p>
										<p className="text-sm mt-2">
											Complete practice challenges to earn XP!
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{data.map((entry) => (
											<LeaderboardItem key={entry.rank} entry={entry} />
										))}
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</main>

			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					© 2026 Non-Tech Speak. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
