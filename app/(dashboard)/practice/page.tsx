"use client";

import { CheckCircle2, Lock, Play, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

// Mock Data
const CHALLENGES = [
	{
		id: "c1",
		title: "Explain 'API' to a Grandparent",
		description:
			"Goal: Explain how software talks to software without using jargon.",
		difficulty: "Beginner",
		xp: 50,
		status: "completed",
		tags: ["System Design", "Web"],
	},
	{
		id: "c2",
		title: "Explain 'Cloud Computing'",
		description:
			"Goal: Describe on-demand computing resources using a real-world analogy.",
		difficulty: "Beginner",
		xp: 50,
		status: "unlocked",
		tags: ["Infrastructure", "Cloud"],
	},
	{
		id: "c3",
		title: "Explain 'Encryption'",
		description:
			"Goal: Illustrate how data is protected from unauthorized access.",
		difficulty: "Intermediate",
		xp: 100,
		status: "locked",
		tags: ["Security", "Cryptography"],
	},
	{
		id: "c4",
		title: "Explain 'Blockchain'",
		description: "Goal: Define a decentralized ledger system simply.",
		difficulty: "Expert",
		xp: 150,
		status: "locked",
		tags: ["Web3", "Database"],
	},
];

export default function PracticeListPage() {
	const [search, setSearch] = useState("");
	const [difficulty, setDifficulty] = useState("all");
	const [status, setStatus] = useState("all");

	const filteredChallenges = CHALLENGES.filter((c) => {
		const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
		const matchesDifficulty =
			difficulty === "all" ||
			c.difficulty.toLowerCase() === difficulty.toLowerCase();

		// Status logic
		let matchesStatus = true;
		if (status === "completed") matchesStatus = c.status === "completed";
		if (status === "not_started") matchesStatus = c.status !== "completed";

		return matchesSearch && matchesDifficulty && matchesStatus;
	});

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
					<span className="font-bold">1,250 XP</span>
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
				<div className="flex gap-2">
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
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="not_started">Not Started</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Challenge Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredChallenges.map((challenge) => (
					<Card
						key={challenge.id}
						className={`flex flex-col ${challenge.status === "locked" ? "opacity-75 bg-slate-50 dark:bg-slate-900" : ""}`}
					>
						<CardHeader>
							<div className="flex justify-between items-start mb-2">
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
								{challenge.status === "completed" && (
									<CheckCircle2 className="h-5 w-5 text-green-500" />
								)}
								{challenge.status === "locked" && (
									<Lock className="h-5 w-5 text-muted-foreground" />
								)}
							</div>
							<CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
							<div className="flex gap-1 mt-2 mb-2">
								{challenge.tags.map((tag) => (
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
								Reward: {challenge.xp} XP
							</div>
						</CardContent>
						<CardFooter>
							{challenge.status === "locked" ? (
								<Button disabled className="w-full">
									Locked
								</Button>
							) : (
								<Button asChild className="w-full">
									<Link href={`/practice/${challenge.id}`}>
										Start Challenge <Play className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
