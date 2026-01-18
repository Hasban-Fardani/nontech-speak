"use client";

import { format } from "date-fns";
import {
	ArrowLeft,
	Bot,
	Calendar,
	Check,
	Clock,
	Copy,
	Eye,
	EyeOff,
	MoreVertical,
	Quote,
	Share2,
	Sparkles,
	Trash2,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoryDetailProps {
	id: string;
}

type Translation = {
	id: string;
	technicalText: string;
	simplifiedText: string;
	audienceType: "parent" | "partner" | "friend" | "child" | "boss";
	createdAt: string;
	isPublic: boolean;
	aiModel?: string | null;
	inputMethod?: string | null;
};

export function HistoryDetail({ id }: HistoryDetailProps) {
	const router = useRouter();
	const [copiedOriginal, setCopiedOriginal] = React.useState(false);
	const [copiedTranslation, setCopiedTranslation] = React.useState(false);
	const [translation, setTranslation] = React.useState<Translation | null>(
		null,
	);
	const [loading, setLoading] = React.useState(true);
	const [deleting, setDeleting] = React.useState(false);
	const [togglingVisibility, setTogglingVisibility] = React.useState(false);

	React.useEffect(() => {
		async function fetchTranslation() {
			try {
				const response = await fetch(`/api/translation/${id}`);
				if (!response.ok) {
					throw new Error("Translation not found");
				}
				const data = await response.json();
				setTranslation(data);
			} catch (error) {
				console.error("Failed to fetch translation:", error);
				setTranslation(null);
			} finally {
				setLoading(false);
			}
		}

		fetchTranslation();
	}, [id]);

	const copyToClipboard = (text: string, isOriginal: boolean) => {
		navigator.clipboard.writeText(text);
		if (isOriginal) {
			setCopiedOriginal(true);
			setTimeout(() => setCopiedOriginal(false), 2000);
		} else {
			setCopiedTranslation(true);
			setTimeout(() => setCopiedTranslation(false), 2000);
		}
		toast.info("Copied to clipboard");
	};

	const handleShare = () => {
		const shareUrl = `${window.location.origin}/share/${id}`;
		navigator.clipboard.writeText(shareUrl);
		toast.success("Share link copied to clipboard!");
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this translation?")) {
			return;
		}

		setDeleting(true);
		try {
			const response = await fetch(`/api/translation/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete");
			}

			toast.success("Translation deleted successfully");
			router.push("/history");
		} catch (error) {
			toast.error("Failed to delete translation");
			setDeleting(false);
		}
	};

	const handleToggleVisibility = async () => {
		if (!translation) return;

		setTogglingVisibility(true);
		try {
			const response = await fetch(`/api/translation/${id}/visibility`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isPublic: !translation.isPublic }),
			});

			if (!response.ok) {
				throw new Error("Failed to update visibility");
			}

			const updatedTranslation = await response.json();
			setTranslation({
				...translation,
				isPublic: updatedTranslation.data.isPublic,
			});

			toast.success(
				updatedTranslation.data.isPublic
					? "Translation is now public"
					: "Translation is now private",
			);
		} catch (error) {
			toast.error("Failed to update visibility");
		} finally {
			setTogglingVisibility(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-6 max-w-5xl mx-auto pb-10">
				<Skeleton className="h-10 w-40" />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<Skeleton className="h-64 w-full" />
						<Skeleton className="h-48 w-full" />
					</div>
					<div className="space-y-6">
						<Skeleton className="h-64 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (!translation) {
		return (
			<div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
				<h2 className="text-2xl font-bold">Translation Not Found</h2>
				<p className="text-muted-foreground">
					The translation you are looking for does not exist or has been
					deleted.
				</p>
				<Button onClick={() => router.back()}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Go Back
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-5xl mx-auto pb-10">
			{/* Header Navigation */}
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					className="pl-0 hover:bg-transparent"
					onClick={() => router.back()}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to History
				</Button>

				<div className="flex gap-2">
					<Button
						variant={translation.isPublic ? "default" : "outline"}
						size="sm"
						onClick={handleToggleVisibility}
						disabled={togglingVisibility || deleting}
						className="gap-2"
					>
						{togglingVisibility ? (
							<>
								<Clock className="h-4 w-4 animate-spin" />
								Updating...
							</>
						) : translation.isPublic ? (
							<>
								<Eye className="h-4 w-4" />
								Public
							</>
						) : (
							<>
								<EyeOff className="h-4 w-4" />
								Private
							</>
						)}
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" disabled={deleting || togglingVisibility}>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={handleShare}>
								<Share2 className="mr-2 h-4 w-4" />
								Share
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive"
								onClick={handleDelete}
								disabled={deleting}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								{deleting ? "Deleting..." : "Delete"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content (Original & Translation) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Translation Result Card */}
					<Card className="border-primary/20 shadow-lg bg-primary/5 dark:bg-primary/10">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="p-2 bg-primary/10 rounded-full">
										<Sparkles className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-xl">
											Simplified Explanation
										</CardTitle>
										<CardDescription>
											Translated for {translation.audienceType}
										</CardDescription>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										copyToClipboard(translation.simplifiedText, false)
									}
								>
									{copiedTranslation ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="prose dark:prose-invert max-w-none">
								<p className="text-lg leading-relaxed text-foreground font-medium">
									{translation.simplifiedText}
								</p>
							</div>
						</CardContent>
						<CardFooter className="bg-background/40 border-t border-primary/10 justify-between py-3">
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Bot className="h-3 w-3" />
								<span>
									Generated by {translation.aiModel || "Gemini 2.0 Flash"}
								</span>
							</div>
						</CardFooter>
					</Card>

					{/* Original Text Card */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Quote className="h-5 w-5 text-muted-foreground" />
									<CardTitle className="text-base text-muted-foreground">
										Original Text
									</CardTitle>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										copyToClipboard(translation.technicalText, true)
									}
								>
									{copiedOriginal ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
								{translation.technicalText}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar Metadata */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Calendar className="h-4 w-4" />
									<span>Date</span>
								</div>
								<span className="font-medium text-sm">
									{format(new Date(translation.createdAt), "MMM d, yyyy")}
								</span>
							</div>
							<Separator />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Clock className="h-4 w-4" />
									<span>Time</span>
								</div>
								<span className="font-medium text-sm">
									{format(new Date(translation.createdAt), "h:mm a")}
								</span>
							</div>
							<Separator />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<User className="h-4 w-4" />
									<span>Audience</span>
								</div>
								<Badge variant="secondary" className="capitalize">
									{translation.audienceType}
								</Badge>
							</div>
							<Separator />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Bot className="h-4 w-4" />
									<span>Input Method</span>
								</div>
								<Badge variant="outline" className="capitalize">
									{translation.inputMethod || "text"}
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-primary/5 to-transparent border-0 shadow-sm">
						<CardContent className="pt-6">
							<h4 className="font-semibold mb-2 text-sm">Model Info</h4>
							<p className="text-xs text-muted-foreground mb-4">
								This translation was generated using the{" "}
								<strong>{translation.aiModel || "Gemini 2.0 Flash"}</strong>{" "}
								model.
							</p>
							<Badge variant="outline" className="text-[10px] bg-background">
								{translation.isPublic ? "Public" : "Private"}
							</Badge>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
