"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Globe, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

// Mock data for public translations
const PUBLIC_TRANSLATIONS = [
	{
		id: "share-1",
		originalText:
			"Kubernetes is a container orchestration system for automating application deployment, scaling, and management.",
		translatedText:
			"Think of Kubernetes like a manager at a busy shipping port. Instead of workers moving boxes (containers) manually, this manager automatically decides where every box goes, how many workers are needed, and makes sure everything runs smoothly without crashing.",
		author: {
			name: "Sarah Chen",
			image: "https://avatar.vercel.sh/sarah",
		},
		audience: "friend",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
		views: 128,
	},
	{
		id: "share-2",
		originalText:
			"The CAP theorem states that a distributed data store can only provide two of the following three guarantees: Consistency, Availability, and Partition Tolerance.",
		translatedText:
			"Imagine you run a phone network. You want it to always work (Availability), give everyone the same info (Consistency), and handle broken cables (Partition Tolerance). The rule says you can't have all three perfectly at the same time; you have to pick the two that matter most.",
		author: {
			name: "Mike Ross",
			image: "https://avatar.vercel.sh/mike",
		},
		audience: "child",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
		views: 85,
	},
	{
		id: "share-3",
		originalText:
			"OAuth 2.0 is an authorization framework that enables applications to obtain limited access to user accounts on an HTTP service.",
		translatedText:
			"OAuth is like giving a valet key to a parking attendant. The key opens the car (limited access) so they can park it, but it doesn't open the trunk or glove box (your private info), and they can't drive it home (full control).",
		author: {
			name: "Alex Dev",
			image: "https://avatar.vercel.sh/alex",
		},
		audience: "parent",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
		views: 342,
	},
];

export function PublicFeed() {
	return (
		<section className="py-12 bg-slate-50 dark:bg-slate-900/50">
			<div className="container px-4 md:px-6">
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
					{PUBLIC_TRANSLATIONS.map((item) => (
						<Card
							key={item.id}
							className="flex flex-col h-full hover:shadow-lg transition-shadow border-primary/10"
						>
							<CardHeader className="pb-3">
								<div className="flex justify-between items-start mb-2">
									<div className="flex items-center gap-2">
										<Avatar className="h-6 w-6">
											<AvatarImage
												src={item.author.image}
												alt={item.author.name}
											/>
											<AvatarFallback>
												<User className="h-3 w-3" />
											</AvatarFallback>
										</Avatar>
										<span className="text-xs font-medium text-muted-foreground">
											{item.author.name}
										</span>
									</div>
									<Badge variant="secondary" className="text-[10px] capitalize">
										For {item.audience}
									</Badge>
								</div>
								<h3 className="font-semibold text-sm line-clamp-2 leading-relaxed">
									{item.originalText}
								</h3>
							</CardHeader>
							<CardContent className="flex-1 pb-3">
								<div className="relative pl-3 border-l-2 border-primary/20">
									<p className="text-sm text-muted-foreground line-clamp-4">
										{item.translatedText}
									</p>
								</div>
							</CardContent>
							<CardFooter className="pt-3 border-t bg-background/50 flex justify-between items-center text-xs text-muted-foreground">
								<div className="flex items-center gap-2">
									<span>{formatDistanceToNow(item.createdAt)} ago</span>
									<span>•</span>
									<span>{item.views} views</span>
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
					<Button variant="outline" size="lg">
						Browse All Examples
					</Button>
				</div>
			</div>
		</section>
	);
}
