"use client";

import { ArrowLeft, Library, Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

type Example = {
	id: string;
	technicalText: string;
	simplifiedText: string;
	audienceType: string;
	upvotesCount: number;
	viewCount: number;
	createdAt: string;
	aiModel?: string | null;
	user?: {
		name: string | null;
		image: string | null;
	};
};

export default function PublicLibraryPage() {
	const [examples, setExamples] = React.useState<Example[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [search, setSearch] = React.useState("");
	const [category, setCategory] = React.useState("all");
	const [sort, setSort] = React.useState("popular");

	React.useEffect(() => {
		async function fetchExamples() {
			try {
				const response = await fetch("/api/public/feed?limit=50");
				if (!response.ok) throw new Error("Failed to fetch");
				const data = await response.json();
				setExamples(data);
			} catch (error) {
				console.error("Failed to fetch examples:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchExamples();
	}, []);

	// Filter Logic
	const filteredExamples = examples.filter((ex) => {
		const matchesSearch =
			ex.technicalText.toLowerCase().includes(search.toLowerCase()) ||
			ex.simplifiedText.toLowerCase().includes(search.toLowerCase());
		const matchesCategory =
			category === "all" ||
			ex.audienceType.toLowerCase() === category.toLowerCase();
		return matchesSearch && matchesCategory;
	});

	// Sort Logic
	const sortedExamples = [...filteredExamples].sort((a, b) => {
		if (sort === "popular") return b.upvotesCount - a.upvotesCount;
		if (sort === "newest")
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		return 0;
	});

	const categories = Array.from(
		new Set(examples.map((e) => e.audienceType)),
	).sort();

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
								<span className="font-bold">{examples.length} Examples</span>
							</div>
						</div>
					</div>

					{/* Filter Toolbar */}
					<div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search examples..."
								className="pl-9"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<div className="flex gap-2">
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="w-[160px]">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Audiences</SelectItem>
									{categories.map((c) => (
										<SelectItem key={c} value={c} className="capitalize">
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={sort} onValueChange={setSort}>
								<SelectTrigger className="w-[160px]">
									<SelectValue placeholder="Sort By" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="popular">Most Popular</SelectItem>
									<SelectItem value="newest">Newest First</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{loading ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[...Array(6)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static
								<Skeleton key={i} className="h-64 rounded-xl" />
							))}
						</div>
					) : (
						<>
							{/* Grid */}
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{sortedExamples.map((ex) => (
									<ExampleCard
										key={ex.id}
										id={ex.id}
										title={ex.technicalText}
										description={ex.simplifiedText}
										tags={[ex.audienceType, ex.aiModel || "AI"]}
										initialUpvotes={ex.upvotesCount}
										content={ex.simplifiedText}
										href={`/examples/${ex.id}`}
									/>
								))}
							</div>

							{sortedExamples.length === 0 && (
								<div className="text-center py-20 text-muted-foreground">
									{examples.length === 0
										? "No public examples yet. Be the first to share!"
										: "No examples found matching your filters."}
								</div>
							)}
						</>
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
