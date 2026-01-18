"use client";

import { Crown, Medal } from "lucide-react";
import { useState } from "react";
import { PublicHeader } from "@/components/organisms/PublicHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data Types
type LeaderboardEntry = {
	rank: number;
	user: {
		name: string;
		avatar: string; // url or fallback
		initials: string;
	};
	xp: number;
	streak: number;
};

// Mock Data Generator (Simplified for Public View)
const generateData = (count: number): LeaderboardEntry[] => {
	return Array.from({ length: count })
		.map((_, i) => ({
			rank: i + 1,
			user: {
				name: `User ${i + 1}`,
				avatar: "",
				initials: `U${i + 1}`,
			},
			xp: Math.floor(Math.random() * 5000) + 1000 - i * 100,
			streak: Math.floor(Math.random() * 30),
		}))
		.sort((a, b) => b.xp - a.xp)
		.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
};

const MOCK_DATA: Record<string, LeaderboardEntry[]> = {
	today: generateData(10),
	week: generateData(10),
	month: generateData(10),
	all_time: generateData(10),
};

export default function RankingsPage() {
	const [period, setPeriod] = useState("today");
	const data = MOCK_DATA[period];

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

					<Card>
						<CardHeader>
							<CardTitle>Rankings</CardTitle>
							<CardDescription>
								Top contributors for this period.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{data.map((entry) => (
									<div
										key={entry.rank}
										className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
									>
										<div className="flex items-center gap-4">
											<div
												className={`
                                            flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg
                                            ${entry.rank === 1 ? "text-yellow-500" : ""}
                                            ${entry.rank === 2 ? "text-slate-400" : ""}
                                            ${entry.rank === 3 ? "text-amber-600" : ""}
                                            ${entry.rank > 3 ? "text-muted-foreground" : ""}
                                        `}
											>
												{entry.rank <= 3 ? (
													<Medal className="h-6 w-6" />
												) : (
													entry.rank
												)}
											</div>
											<Avatar className="h-10 w-10 border">
												<AvatarImage src={entry.user.avatar} />
												<AvatarFallback>{entry.user.initials}</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium lead-none">
													{entry.user.name}
												</p>
												<p className="text-sm text-muted-foreground flex items-center gap-1">
													🔥 {entry.streak} day streak
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="font-bold text-lg">
												{entry.xp.toLocaleString()} XP
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
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
