"use client";

import { Copy, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ExampleCardProps {
	id: string;
	title: string;
	description: string;
	tags: string[];
	initialUpvotes: number;
	content: string; // The actual text to copy
	href?: string; // Optional link to detail page
}

export function ExampleCard({
	title,
	description,
	tags,
	initialUpvotes,
	content,
	href,
}: ExampleCardProps) {
	const [upvotes, setUpvotes] = useState(initialUpvotes);
	const [hasUpvoted, setHasUpvoted] = useState(false);

	const handleUpvote = () => {
		if (hasUpvoted) {
			setUpvotes((prev) => prev - 1);
			setHasUpvoted(false);
		} else {
			setUpvotes((prev) => prev + 1);
			setHasUpvoted(true);
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(content);
		toast.success("Copied to clipboard!");
	};

	return (
		<Card className="flex flex-col h-full hover:border-primary/50 transition-colors group relative">
			{href && (
				<Link href={href} className="absolute inset-0 z-0">
					<span className="sr-only">View Detail</span>
				</Link>
			)}
			<CardHeader className="relative z-10 pointer-events-none">
				<div className="flex justify-between items-start gap-2 pointer-events-auto">
					<CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
						{title}
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-foreground z-20"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleCopy();
						}}
						title="Copy content"
					>
						<Copy className="h-4 w-4" />
						<span className="sr-only">Copy</span>
					</Button>
				</div>
				<div className="flex flex-wrap gap-1 mt-2 pointer-events-auto">
					{tags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="text-[10px] px-1 py-0 h-5 font-normal"
						>
							{tag}
						</Badge>
					))}
				</div>
			</CardHeader>
			<CardContent className="flex-1 relative z-10 pointer-events-none">
				<p className="text-sm text-muted-foreground line-clamp-3">
					{description}
				</p>
			</CardContent>
			<CardFooter className="pt-2 border-t bg-muted/20 relative z-10 pointer-events-auto">
				<Button
					variant={hasUpvoted ? "secondary" : "ghost"}
					size="sm"
					className={`w-full gap-2 ${hasUpvoted ? "text-primary font-bold" : "text-muted-foreground"}`}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleUpvote();
					}}
				>
					<ThumbsUp className={`h-4 w-4 ${hasUpvoted ? "fill-current" : ""}`} />
					{upvotes} {upvotes === 1 ? "Upvote" : "Upvotes"}
				</Button>
			</CardFooter>
		</Card>
	);
}
