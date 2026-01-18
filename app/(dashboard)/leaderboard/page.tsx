"use client";

import { Crown, Medal } from "lucide-react";
import * as React from "react";
import {
	type LeaderboardEntry,
	LeaderboardItem,
} from "@/components/molecules/LeaderboardItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LeaderboardPage() {
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

	if (loading) {
		return (
			<div className="space-y-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
						<p className="text-muted-foreground mt-1">
							See who's mastering technical communication.
						</p>
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

				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32 mb-2" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
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
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
					<p className="text-muted-foreground mt-1">
						See who's mastering technical communication.
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

			<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Rankings</CardTitle>
						<CardDescription>Top contributors for this period.</CardDescription>
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
			</div>
		</div>
	);
}
