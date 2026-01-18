"use client";

import { Send, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
	id: string;
	author: {
		name: string;
		image?: string;
	};
	content: string;
	createdAt: string;
}

interface CommentSectionProps {
	initialComments?: Comment[];
	readOnly?: boolean;
}

export function CommentSection({
	initialComments = [],
	readOnly = false,
}: CommentSectionProps) {
	const [comments, setComments] = useState<Comment[]>(initialComments);
	const [newComment, setNewComment] = useState("");

	const handleSubmit = () => {
		if (!newComment.trim()) return;

		const comment: Comment = {
			id: Math.random().toString(36).substr(2, 9),
			author: {
				name: "You", // Mock current user
			},
			content: newComment,
			createdAt: "Just now",
		};

		setComments([comment, ...comments]);
		setNewComment("");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{!readOnly && (
					<div className="flex gap-4">
						<Avatar className="h-10 w-10">
							<AvatarFallback>
								<User className="h-5 w-5" />
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 space-y-2">
							<Textarea
								placeholder="Add a comment..."
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								className="min-h-[80px]"
							/>
							<div className="flex justify-end">
								<Button size="sm" onClick={handleSubmit} disabled={!newComment}>
									Post Comment <Send className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				)}

				<div className="space-y-4">
					{comments.map((comment) => (
						<div key={comment.id} className="flex gap-4">
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={comment.author.image}
									alt={comment.author.name}
								/>
								<AvatarFallback>
									<User className="h-5 w-5" />
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-1">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-sm">
										{comment.author.name}
									</span>
									<span className="text-xs text-muted-foreground">
										{comment.createdAt}
									</span>
								</div>
								<p className="text-sm text-foreground/90">{comment.content}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
