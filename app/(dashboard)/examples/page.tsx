"use client";

import { Library, Search } from "lucide-react";
import * as React from "react";
import { ExampleCard } from "@/components/molecules/ExampleCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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

export default function ExamplesPage() {
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

	if (loading) {
		return (
			<div className="space-y-8">
				<Skeleton className="h-20 w-full" />
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
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
					<h1 className="text-3xl font-bold tracking-tight">Example Library</h1>
					<p className="text-muted-foreground mt-1">
						Browse community-contributed analogies and explanations.
					</p>
				</div>
				<div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800">
					<Library className="h-5 w-5" />
					<span className="font-bold">{examples.length} Examples</span>
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
		</div>
	);
}
