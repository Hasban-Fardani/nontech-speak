"use client";

import { ArrowLeft, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { CommentSection } from "@/components/organisms/CommentSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
};

export default function ExampleDetailPage() {
	const params = useParams();
	const id = params.id as string;

	const [translation, setTranslation] = React.useState<Translation | null>(
		null,
	);
	const [loading, setLoading] = React.useState(true);
	const [upvotes, setUpvotes] = React.useState(0);
	const [voteStatus, setVoteStatus] = React.useState<"up" | "down" | null>(
		null,
	);
	const [voting, setVoting] = React.useState(false);

	React.useEffect(() => {
		async function fetchTranslation() {
			try {
				const response = await fetch(`/api/share/${id}`);
				if (!response.ok) throw new Error("Not found");
				const data = await response.json();
				setTranslation(data);
				setUpvotes(data.upvotesCount);

				// Fetch vote status
				const voteResponse = await fetch(`/api/translation/${id}/vote`);
				if (voteResponse.ok) {
					const voteData = await voteResponse.json();
					setVoteStatus(voteData.voteType);
				}
			} catch (error) {
				console.error("Failed to fetch:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchTranslation();
	}, [id]);

	const handleVote = async (type: "up" | "down") => {
		setVoting(true);
		try {
			const response = await fetch(`/api/translation/${id}/vote`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ voteType: type }),
			});

			if (!response.ok) {
				throw new Error("Failed to vote");
			}

			const data = await response.json();
			setUpvotes(data.upvotesCount);
			setVoteStatus(data.voteType);
		} catch (error) {
			toast.error("Failed to vote. Please try again.");
		} finally {
			setVoting(false);
		}
	};

	const handleCopy = () => {
		if (translation) {
			navigator.clipboard.writeText(translation.simplifiedText);
			toast.success("Copied to clipboard");
		}
	};

	if (loading) {
		return (
			<div className="space-y-6 max-w-3xl mx-auto">
				<Skeleton className="h-10 w-40" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (!translation) {
		return (
			<div className="text-center py-20">
				<h2 className="text-2xl font-bold mb-4">Example Not Found</h2>
				<Button asChild>
					<Link href="/examples">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Library
					</Link>
				</Button>
			</div>
		);
	}

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
					<h1 className="text-3xl font-bold tracking-tight">
						{translation.technicalText}
					</h1>
					<div className="flex gap-2">
						<Button variant="outline" size="icon" onClick={handleCopy}>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div className="flex gap-2">
					<Badge variant="secondary" className="capitalize">
						{translation.audienceType}
					</Badge>
					{translation.aiModel && (
						<Badge variant="outline">{translation.aiModel}</Badge>
					)}
				</div>
			</div>

			<Card>
				<CardContent className="p-6 text-lg leading-relaxed">
					{translation.simplifiedText}
				</CardContent>
			</Card>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
					<Button
						variant={voteStatus === "up" ? "secondary" : "ghost"}
						size="sm"
						className={voteStatus === "up" ? "text-primary bg-primary/10" : ""}
						onClick={() => handleVote("up")}
						disabled={voting}
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
						onClick={() => handleVote("down")}
						disabled={voting}
					>
						<ThumbsDown className="h-4 w-4" />
					</Button>
				</div>
				<Separator orientation="vertical" className="h-8" />
				<span className="text-sm text-muted-foreground">
					{translation.viewCount} views
				</span>
			</div>

			<CommentSection initialComments={[]} />
		</div>
	);
}
