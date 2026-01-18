"use client";

import { Crown } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { LeaderboardItem, type LeaderboardEntry } from "@/components/molecules/LeaderboardItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LandingLeaderboard() {
	const [data, setData] = React.useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchLeaderboard() {
			try {
				const res = await fetch("/api/leaderboard?period=all_time");
				if (res.ok) {
					const leaderboard = await res.json();
					setData(leaderboard.slice(0, 5)); // Top 5 only
				}
			} catch (error) {
				console.error("Failed to fetch leaderboard:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchLeaderboard();
	}, []);

	if (loading) {
		return (
			<section className="w-full py-12 md:py-24 bg-slate-50 dark:bg-slate-900/50">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Top Contributors
							</h2>
							<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
								Join our community of technical communicators.
							</p>
						</div>
					</div>
					<div className="max-w-3xl mx-auto space-y-4">
						{[...Array(5)].map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton list
							<Skeleton key={i} className="h-20 w-full rounded-lg" />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (data.length === 0) return null;

	return (
		<section className="w-full py-12 md:py-24 bg-slate-50 dark:bg-slate-900/50">
			<div className="container px-4 md:px-6 mx-auto">
				<div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
					<div className="space-y-2">
						<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-500 mb-4">
							<Crown className="w-3 h-3 mr-1" />
							Season 1 Leaders
						</div>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Top Contributors
						</h2>
						<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
							See who's mastering the art of simple explanation.
						</p>
					</div>
				</div>

				<div className="max-w-3xl mx-auto">
					<Card>
						<CardContent className="p-0">
							<div className="divide-y">
								{data.map((entry) => (
									<LeaderboardItem 
                                        key={entry.rank} 
                                        entry={entry} 
                                        className="border-none rounded-none first:rounded-t-lg last:rounded-b-lg hover:bg-muted/50 transition-colors" 
                                    />
								))}
							</div>
						</CardContent>
					</Card>
					
					<div className="mt-8 text-center">
						<Link href="/leaderboard">
							<Button variant="outline" size="lg" className="rounded-full">
								View Full Leaderboard
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
