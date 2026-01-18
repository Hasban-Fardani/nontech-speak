"use client";

import { ArrowLeft, Copy, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";
import { CommentSection } from "@/components/organisms/CommentSection";
import { PublicHeader } from "@/components/organisms/PublicHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock Data (Duplicated for demo simplicity, normally fetched)
const EXAMPLES = {
	"1": {
		id: "1",
		title: "Kubernetes for 5-year-olds",
		description:
			"Imagine a shipping container port. The huge ship is the server, and the containers are the apps. Kubernetes is the crane operator deciding where each container goes.",
		content:
			"Imagine a shipping container port. The huge ship is the server, and the containers are the apps. Kubernetes is the crane operator deciding where each container goes. It ensures the ship isn't overloaded and that containers are stacked safely. If a container falls off (crashes), the operator immediately puts a new one in its place.",
		tags: ["DevOps", "Infrastructure"],
		upvotes: 120,
		category: "DevOps",
		date: "2023-10-15",
		comments: [
			{
				id: "c1",
				author: { name: "DevOpsDave" },
				content: "This is the best explanation I've seen!",
				createdAt: "2 days ago",
			},
		],
	},
};

export default function PublicLibraryDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	// Mock usage
	console.log("Fetching public example:", id);
	const example = EXAMPLES["1" as keyof typeof EXAMPLES] || EXAMPLES["1"];

	const handleCopy = () => {
		navigator.clipboard.writeText(example.content);
		toast.success("Copied to clipboard");
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Shared Header */}
			<PublicHeader />

			<main className="flex-1 py-12 container mx-auto px-4 md:px-6">
				<div className="max-w-3xl mx-auto space-y-6">
					<Button
						variant="ghost"
						className="pl-0 hover:pl-2 transition-all"
						asChild
					>
						<Link href="/library">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
						</Link>
					</Button>

					<div className="space-y-4">
						<div className="flex items-start justify-between">
							<h1 className="text-3xl font-bold tracking-tight">
								{example.title}
							</h1>
							<div className="flex gap-2">
								<Button variant="outline" size="icon" onClick={handleCopy}>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<div className="flex gap-2">
							{example.tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
						</div>
					</div>

					<Card>
						<CardContent className="p-6 text-lg leading-relaxed">
							{example.content}
						</CardContent>
					</Card>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5">
							<ThumbsUp className="h-4 w-4" />
							<span className="font-bold">{example.upvotes} Upvotes</span>
						</div>
						<span className="text-sm text-muted-foreground">
							Posted on {example.date}
						</span>
					</div>

					<div className="pt-8 border-t">
						<h3 className="text-lg font-semibold mb-6">Discussion</h3>
						<CommentSection initialComments={example.comments} readOnly />
						<div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-center">
							<p className="text-sm text-muted-foreground mb-3">
								Want to join the discussion?
							</p>
							<Button asChild>
								<Link href="/login">Sign In to Comment</Link>
							</Button>
						</div>
					</div>
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
