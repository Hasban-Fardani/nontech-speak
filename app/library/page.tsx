"use client";

import { ArrowLeft, Library, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ExampleCard } from "@/components/molecules/ExampleCard";
import { PublicHeader } from "@/components/organisms/PublicHeader";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Mock Data (Same as dashboard for consistency, but could be separate)
const EXAMPLES = [
	{
		id: "1",
		title: "Kubernetes for 5-year-olds",
		description:
			"Imagine a shipping container port. The huge ship is the server, and the containers are the apps...",
		content:
			"Imagine a shipping container port. The huge ship is the server, and the containers are the apps. Kubernetes is the crane operator deciding where each container goes.",
		tags: ["DevOps", "Infrastructure"],
		upvotes: 120,
		category: "DevOps",
		date: "2023-10-15",
	},
	{
		id: "2",
		title: "API explained as a Waiter",
		description:
			"You are at a restaurant. You (Client) give order to Waiter (API), who takes it to Kitchen (Server)...",
		content:
			"You are at a restaurant. You (Client) give order to Waiter (API), who takes it to Kitchen (Server) and brings back the food (Response). You don't need to know how the kitchen cooks it.",
		tags: ["Web", "API"],
		upvotes: 345,
		category: "Web Development",
		date: "2023-11-20",
	},
	{
		id: "3",
		title: "Encryption as a locked box",
		description:
			"Sending a message in a locked box where only the receiver has the key...",
		content:
			"Sending a message in a locked box where only the receiver has the key. Even if the mailman steals the box, they can't see the message inside.",
		tags: ["Security", "Cryptography"],
		upvotes: 89,
		category: "Security",
		date: "2023-12-05",
	},
	{
		id: "4",
		title: "Machine Learning as a Student",
		description:
			"Traditional programming is giving rules to a computer. ML is giving examples to a student...",
		content:
			"Traditional programming is giving rules to a computer. ML is giving examples to a student and letting them figure out the rules themselves by practicing repeatedly.",
		tags: ["AI", "Data Science"],
		upvotes: 210,
		category: "AI",
		date: "2026-01-10",
	},
	{
		id: "5",
		title: "Database Index as a Book Index",
		description:
			"Finding a page in a book is faster if you look at the index first instead of flipping every page...",
		content:
			"Finding a page in a book is faster if you look at the index first instead of flipping every page. A database index works the same way to find data quickly.",
		tags: ["Database", "Backend"],
		upvotes: 156,
		category: "Backend",
		date: "2023-09-30",
	},
];

export default function PublicLibraryPage() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("all");
	const [sort, setSort] = useState("popular");

	// Filter Logic - Secure against simple matching issues by lowercasing
	const filteredExamples = EXAMPLES.filter((ex) => {
		const term = search.toLowerCase();
		// Prevent ReDoS or expensive regex if we were using it, but here just simple includes
		const matchesSearch =
			ex.title.toLowerCase().includes(term) ||
			ex.description.toLowerCase().includes(term);
		const matchesCategory =
			category === "all" ||
			ex.category.toLowerCase() === category.toLowerCase();
		return matchesSearch && matchesCategory;
	});

	// Sort Logic
	const sortedExamples = [...filteredExamples].sort((a, b) => {
		if (sort === "popular") return b.upvotes - a.upvotes;
		if (sort === "newest")
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		return 0;
	});

	const categories = Array.from(new Set(EXAMPLES.map((e) => e.category)));

	return (
		<div className="flex flex-col min-h-screen">
			{/* Shared Header */}
			<PublicHeader />

			<main className="flex-1 py-12 container mx-auto px-4 md:px-6">
				<div className="flex flex-col gap-6">
					<div>
						<Link
							href="/"
							className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
						>
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
						</Link>
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
							<div>
								<h1 className="text-3xl font-bold tracking-tight">
									Example Library
								</h1>
								<p className="text-muted-foreground mt-1">
									Explore how technical concepts can be simplified.
								</p>
							</div>
							<div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800">
								<Library className="h-5 w-5" />
								<span className="font-bold">{EXAMPLES.length} Examples</span>
							</div>
						</div>
					</div>

					{/* Filter Toolbar */}
					<div className="flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border shadow-sm">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search examples..."
								className="pl-9 bg-background"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<div className="flex gap-2">
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="w-[160px] bg-background">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories.map((c) => (
										<SelectItem key={c} value={c}>
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={sort} onValueChange={setSort}>
								<SelectTrigger className="w-[160px] bg-background">
									<SelectValue placeholder="Sort By" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="popular">Most Popular</SelectItem>
									<SelectItem value="newest">Newest First</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{sortedExamples.map((ex) => (
							<ExampleCard
								key={ex.id}
								title={ex.title}
								description={ex.description}
								tags={ex.tags}
								initialUpvotes={ex.upvotes}
								content={ex.content}
								href={`/library/${ex.id}`}
							/>
						))}
					</div>

					{sortedExamples.length === 0 && (
						<div className="text-center py-20 text-muted-foreground">
							No examples found matching your filters.
						</div>
					)}
				</div>
			</main>

			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					© 2026 Non-Tech Speak. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Terms of Service
					</Link>
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
