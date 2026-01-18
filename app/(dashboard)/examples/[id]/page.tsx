"use client";

import { ArrowLeft, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";
import { CommentSection } from "@/components/organisms/CommentSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock Data (Shared source of truth idea)
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
	// ... we'd fetch this by ID in real app
};

export default function ExampleDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	// Mock usage to satisfy linter until real data fetch
	console.log("Fetching example:", id);
	// Fallback to mock item 1 for demo if ID doesn't match
	const example = EXAMPLES["1" as keyof typeof EXAMPLES] || EXAMPLES["1"];
	// In real app: const example = EXAMPLES[id] || notFound();

	const [upvotes, setUpvotes] = useState(example.upvotes);
	const [voteStatus, setVoteStatus] = useState<"up" | "down" | null>(null);

	const handleUpvote = () => {
		if (voteStatus === "up") {
			setUpvotes((prev) => prev - 1);
			setVoteStatus(null);
		} else {
			setUpvotes((prev) => (voteStatus === "down" ? prev + 2 : prev + 1));
			setVoteStatus("up");
		}
	};

	const handleDownvote = () => {
		if (voteStatus === "down") {
			setUpvotes((prev) => prev + 1);
			setVoteStatus(null);
		} else {
			setUpvotes((prev) => (voteStatus === "up" ? prev - 2 : prev - 1));
			setVoteStatus("down");
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(example.content);
		toast.success("Copied to clipboard");
	};

	return (
		<div className="space-y-6 max-w-3xl mx-auto">
			<Button
				variant="ghost"
				className="pl-0 hover:pl-2 transition-all"
				asChild
			>
				<Link href="/examples">
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
				</Link>
			</Button>

			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<h1 className="text-3xl font-bold tracking-tight">{example.title}</h1>
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
				<div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
					<Button
						variant={voteStatus === "up" ? "secondary" : "ghost"}
						size="sm"
						className={voteStatus === "up" ? "text-primary bg-primary/10" : ""}
						onClick={handleUpvote}
					>
						<ThumbsUp className="h-4 w-4 mr-2" />
						Upvote
					</Button>
					<span className="min-w-[3ch] text-center font-bold">{upvotes}</span>
					<Button
						variant={voteStatus === "down" ? "secondary" : "ghost"}
						size="sm"
						className={
							voteStatus === "down" ? "text-destructive bg-destructive/10" : ""
						}
						onClick={handleDownvote}
					>
						<ThumbsDown className="h-4 w-4" />
					</Button>
				</div>
				<Separator orientation="vertical" className="h-8" />
				<span className="text-sm text-muted-foreground">
					Posted on {example.date}
				</span>
			</div>

			<CommentSection initialComments={example.comments} />
		</div>
	);
}
