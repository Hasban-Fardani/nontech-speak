"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Globe, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Translation = {
	id: string;
	technicalText: string;
	simplifiedText: string;
	audienceType: string;
	aiModel?: string | null;
	viewCount: number;
	upvotesCount: number;
	createdAt: string;
	user?: {
		name: string | null;
		image: string | null;
	};
};

export function PublicTranslations() {
	const [translations, setTranslations] = React.useState<Translation[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchTranslations() {
			try {
				const response = await fetch("/api/public/feed?limit=3");
				if (!response.ok) throw new Error("Failed to fetch");
				const data = await response.json();
				setTranslations(data);
			} catch (error) {
				console.error("Failed to fetch translations:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchTranslations();
	}, []);

	if (loading) {
		return (
			<section className="py-12 bg-slate-50 dark:bg-slate-900/50">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
						<Badge
							variant="outline"
							className="px-3 py-1 border-primary/20 bg-primary/5 text-primary"
						>
							<Globe className="mr-1 h-3 w-3" /> Community
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
							Public Translations
						</h2>
						<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
							See how others are simplifying complex topics.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static
							<Skeleton key={i} className="h-64 rounded-xl" />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (translations.length === 0) return null;

	return (
		<section className="py-12 bg-slate-50 dark:bg-slate-900/50">
			<div className="container px-4 md:px-6 mx-auto">
				<div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
					<Badge
						variant="outline"
						className="px-3 py-1 border-primary/20 bg-primary/5 text-primary"
					>
						<Globe className="mr-1 h-3 w-3" /> Community
					</Badge>
					<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
						Public Translations
					</h2>
					<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
						See how others are simplifying complex topics.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{translations.map((item) => (
						<Card
							key={item.id}
							className="flex flex-col h-full hover:shadow-lg transition-shadow border-primary/10"
						>
							<CardHeader className="pb-3">
								<div className="flex justify-between items-start mb-2">
									<div className="flex items-center gap-2">
										<Avatar className="h-6 w-6">
											<AvatarImage
												src={item.user?.image || ""}
												alt={item.user?.name || "User"}
											/>
											<AvatarFallback>
												<User className="h-3 w-3" />
											</AvatarFallback>
										</Avatar>
										<span className="text-xs font-medium text-muted-foreground">
											{item.user?.name || "Anonymous"}
										</span>
									</div>
									<Badge variant="secondary" className="text-[10px] capitalize">
										For {item.audienceType}
									</Badge>
								</div>
								<h3 className="font-semibold text-sm line-clamp-2 leading-relaxed">
									{item.technicalText}
								</h3>
							</CardHeader>
							<CardContent className="flex-1 pb-3">
								<div className="relative pl-3 border-l-2 border-primary/20">
									<p className="text-sm text-muted-foreground line-clamp-4">
										{item.simplifiedText}
									</p>
								</div>
							</CardContent>
							<CardFooter className="pt-3 border-t bg-background/50 flex justify-between items-center text-xs text-muted-foreground">
								<div className="flex items-center gap-2">
									<span>
										{formatDistanceToNow(new Date(item.createdAt))} ago
									</span>
									<span>•</span>
									<span>{item.viewCount} views</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									asChild
									className="h-6 px-2 hover:bg-transparent hover:text-primary"
								>
									<Link href={`/share/${item.id}`}>
										Read <ArrowRight className="ml-1 h-3 w-3" />
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				<div className="mt-10 text-center">
					<Button variant="outline" size="lg" asChild>
						<Link href="/library">Browse All Examples</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
