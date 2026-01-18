"use client";

import { Play, Search, Trophy } from "lucide-react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type Challenge = {
	id: string;
	title: string;
	description: string;
	difficulty: "beginner" | "intermediate" | "expert";
	xpReward: number;
	tags: string[];
	hints: string[];
	isActive: boolean;
};

export default function PracticeListPage() {
	const [challenges, setChallenges] = React.useState<Challenge[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [search, setSearch] = React.useState("");
	const [difficulty, setDifficulty] = React.useState("all");
	const [totalXp, setTotalXp] = React.useState(0);

	React.useEffect(() => {
		async function fetchData() {
			try {
				const [challengesRes, settingsRes] = await Promise.all([
					fetch("/api/practice/challenges"),
					fetch("/api/user/settings"),
				]);

				if (challengesRes.ok) {
					const data = await challengesRes.json();
					setChallenges(data);
				}

				if (settingsRes.ok) {
					const userData = await settingsRes.json();
					setTotalXp(userData.totalXp || 0);
				}
			} catch (error) {
				console.error("Failed to fetch:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const filteredChallenges = challenges.filter((c) => {
		const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
		const matchesDifficulty =
			difficulty === "all" || c.difficulty === difficulty;
		return matchesSearch && matchesDifficulty;
	});

	if (loading) {
		return (
			<div className="space-y-8">
				<Skeleton className="h-20 w-full" />
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static
						<Skeleton key={i} className="h-64" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Practice Zone</h1>
					<p className="text-muted-foreground mt-1">
						Master technical concepts through daily challenges.
					</p>
				</div>
				<div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
					<Trophy className="h-5 w-5 text-yellow-500" />
					<span className="font-bold">{totalXp.toLocaleString()} XP</span>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search challenges..."
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<Select value={difficulty} onValueChange={setDifficulty}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Difficulty" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Levels</SelectItem>
						<SelectItem value="beginner">Beginner</SelectItem>
						<SelectItem value="intermediate">Intermediate</SelectItem>
						<SelectItem value="expert">Expert</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Challenge Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredChallenges.map((challenge) => (
					<Card key={challenge.id} className="flex flex-col">
						<CardHeader>
							<div className="flex justify-between items-start mb-2">
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
							</div>
							<CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
							<div className="flex gap-1 mt-2 mb-2">
								{challenge.tags?.map((tag) => (
									<Badge
										key={tag}
										variant="outline"
										className="text-[10px] px-1 py-0 h-4 font-normal"
									>
										{tag}
									</Badge>
								))}
							</div>
							<CardDescription className="line-clamp-2">
								{challenge.description}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-1">
							<div className="text-sm font-medium text-muted-foreground">
								Reward: {challenge.xpReward} XP
							</div>
						</CardContent>
						<CardFooter>
							<Button asChild className="w-full">
								<Link href={`/practice/${challenge.id}`}>
									Start Challenge <Play className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			{filteredChallenges.length === 0 && (
				<div className="text-center py-20 text-muted-foreground">
					No challenges found matching your filters.
				</div>
			)}
		</div>
	);
}
