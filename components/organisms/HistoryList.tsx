"use client";

import { format } from "date-fns";
import { ArrowRight, Calendar, Eye, Lock, Sparkles } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// TODO: Replace with actual type from Drizzle schema
export type HistoryItem = {
	id: string;
	originalText: string;
	translatedText: string;
	audience:
		| "child"
		| "teenager"
		| "adult"
		| "expert"
		| "parent"
		| "partner"
		| "friend";
	createdAt: Date;
	isPublic: boolean;
};

// TODO: Remove this dummy data when connecting to backend
export const DUMMY_HISTORY: HistoryItem[] = [
	{
		id: "1",
		originalText:
			"Kubernetes is a container orchestration system for automating application deployment, scaling, and management.",
		translatedText:
			"Think of Kubernetes like a manager at a busy shipping port. Instead of workers moving boxes (containers) manually, this manager automatically decides where every box goes, how many workers are needed, and makes sure everything runs smoothly without crashing.",
		audience: "friend",
		createdAt: new Date("2026-03-10T10:00:00"),
		isPublic: true,
	},
	{
		id: "2",
		originalText:
			"The CAP theorem states that a distributed data store can only provide two of the following three guarantees: Consistency, Availability, and Partition Tolerance.",
		translatedText:
			"Imagine you run a phone network. You want it to always work (Availability), give everyone the same info (Consistency), and handle broken cables (Partition Tolerance). The rule says you can't have all three perfectly at the same time; you have to pick the two that matter most.",
		audience: "child",
		createdAt: new Date("2026-03-09T15:30:00"),
		isPublic: false,
	},
	{
		id: "3",
		originalText:
			"Dependency injection is a design pattern in which an object or function receives other objects or functions that it depends on.",
		translatedText:
			"Instead of building your own tools every time you want to fix a car, someone hands you the exact wrench you need right when you need it. That way, you just focus on fixing the car, not making the tools.",
		audience: "parent",
		createdAt: new Date("2026-03-08T09:15:00"),
		isPublic: true,
	},
];

export function HistoryList() {
	// TODO: Fetch data from backend API
	// const { data: history, isLoading } = useQuery(...)
	const history = DUMMY_HISTORY;

	// Mock Practice History Data
	const PRACTICE_HISTORY = [
		{
			id: "p1",
			challenge: "Explain 'API' to a Grandparent",
			score: 85,
			date: new Date("2026-03-12T14:00:00"),
		},
		{
			id: "p2",
			challenge: "Explain 'Cloud Computing' to a 10-year-old",
			score: 92,
			date: new Date("2026-03-11T09:30:00"),
		},
	];

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
											{item.audience}
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
												{format(item.createdAt, "MMM d, yyyy")}
											</div>
										</div>
									</div>
									<CardTitle className="text-base line-clamp-2 leading-tight">
										{item.originalText}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex-1 pb-3">
									<div className="text-sm text-muted-foreground line-clamp-4">
										<div className="flex items-center gap-2 mb-2 text-primary/80 font-medium">
											<Sparkles className="h-3 w-3" />
											<span>Simplified:</span>
										</div>
										{item.translatedText}
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
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{PRACTICE_HISTORY.map((item) => (
							<Card key={item.id} className="hover:shadow-md transition-shadow">
								<CardHeader className="pb-3">
									<div className="flex justify-between items-start mb-2">
										<Badge
											variant="secondary"
											className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
										>
											Challenge
										</Badge>
										<div className="flex items-center text-xs text-muted-foreground">
											<Calendar className="mr-1 h-3 w-3" />
											{format(item.date, "MMM d, yyyy")}
										</div>
									</div>
									<CardTitle className="text-base">{item.challenge}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between mt-2">
										<span className="text-sm text-muted-foreground">Score</span>
										<Badge
											variant={item.score >= 90 ? "default" : "secondary"}
											className="text-base px-3"
										>
											{item.score}/100
										</Badge>
									</div>
								</CardContent>
								<CardFooter className="pt-3 border-t bg-slate-50 dark:bg-slate-900/50">
									<Button
										variant="ghost"
										size="sm"
										className="w-full text-xs"
										asChild
									>
										<a href={`/practice/${item.id}`}>
											View Feedback <ArrowRight className="ml-2 h-3 w-3" />
										</a>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
