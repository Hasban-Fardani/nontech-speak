"use client";

import {
	ArrowLeft,
	Calendar,
	Globe,
	Languages,
	Lock,
	Share2,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { ShareButton } from "@/components/molecules/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

type TranslationDetail = {
	id: string;
	userId: string;
	technicalText: string;
	simplifiedText: string;
	audienceType: string;
	aiModel: string;
	isPublic: boolean;
	viewCount: number;
	upvotesCount: number;
	createdAt: string;
};

export default function TranslationHistoryDetailPage() {
	const params = useParams();
	const [translation, setTranslation] =
		React.useState<TranslationDetail | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [updating, setUpdating] = React.useState(false);

	React.useEffect(() => {
		async function fetchTranslation() {
			try {
				const res = await fetch(`/api/translation/${params.id}`);
				if (res.ok) {
					const data = await res.json();
					setTranslation(data);
				} else {
					setError("Translation not found");
				}
			} catch (err) {
				setError("Failed to load translation");
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		if (params.id) {
			fetchTranslation();
		}
	}, [params.id]);

	const handleVisibilityToggle = async (checked: boolean) => {
		if (!translation) return;

		setUpdating(true);
		// Optimistic update
		const oldStatus = translation.isPublic;
		setTranslation({ ...translation, isPublic: checked });

		try {
			const res = await fetch(`/api/translation/${translation.id}/visibility`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isPublic: checked }),
			});

			if (!res.ok) {
				throw new Error("Failed to update visibility");
			}

			toast.success(
				checked ? "Translation is now public" : "Translation is now private",
			);
		} catch (error) {
			console.error(error);
			toast.error("Failed to update visibility");
			// Revert on error
			setTranslation({ ...translation, isPublic: oldStatus });
		} finally {
			setUpdating(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-10" />
					<Skeleton className="h-8 w-48" />
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-32 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !translation) {
		return (
			<div className="space-y-6">
				<Link href="/history">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to History
					</Button>
				</Link>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Languages className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							{error || "Translation not found"}
						</h3>
						<p className="text-sm text-muted-foreground text-center mb-4">
							This translation may have been deleted or you don't have access to
							it.
						</p>
						<Link href="/history">
							<Button>Go to History</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<Link href="/history">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to History
					</Button>
				</Link>
				<div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-2 rounded-lg border border-dashed">
					<div className="flex items-center space-x-2">
						<Switch
							id="visibility-mode"
							checked={translation.isPublic}
							onCheckedChange={handleVisibilityToggle}
							disabled={updating}
						/>
						<Label
							htmlFor="visibility-mode"
							className="flex items-center gap-2 cursor-pointer text-sm font-medium"
						>
							{translation.isPublic ? (
								<>
									<Globe className="h-3 w-3 text-green-600" />
									Public
								</>
							) : (
								<>
									<Lock className="h-3 w-3 text-slate-500" />
									Private
								</>
							)}
						</Label>
					</div>

					<div className="h-4 w-px bg-border hidden sm:block" />

					<ShareButton id={translation.id} />
				</div>
			</div>

			{/* Translation Details */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<CardTitle className="text-2xl mb-2">
								Translation Details
							</CardTitle>
							<CardDescription className="flex items-center gap-4">
								<span className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{new Date(translation.createdAt).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
								<Badge variant="outline" className="capitalize">
									{translation.audienceType}
								</Badge>
								<Badge variant="secondary">{translation.aiModel}</Badge>
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Original Technical Text */}
					<div>
						<h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
							Original Technical Text
						</h3>
						<div className="bg-muted/50 rounded-lg p-4">
							<p className="text-base leading-relaxed">
								{translation.technicalText}
							</p>
						</div>
					</div>

					{/* Simplified Text */}
					<div>
						<h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
							Simplified Explanation
						</h3>
						<div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
							<p className="text-base leading-relaxed">
								{translation.simplifiedText}
							</p>
						</div>
					</div>

					{/* Stats */}
					{translation.isPublic && (
						<div className="flex items-center gap-6 pt-4 border-t">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Share2 className="h-4 w-4" />
								<span>{translation.viewCount} views</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="flex items-center gap-2">
									<ArrowUp className="h-4 w-4" />
									{translation.upvotesCount} upvotes
								</span>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex gap-4">
				<Link href="/translate" className="flex-1">
					<Button className="w-full" variant="outline">
						<Languages className="mr-2 h-4 w-4" />
						Create New Translation
					</Button>
				</Link>
			</div>
		</div>
	);
}
