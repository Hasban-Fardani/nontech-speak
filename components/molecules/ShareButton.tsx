"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
	id: string;
	title?: string;
	className?: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
}

export function ShareButton({
	id,
	title,
	className,
	variant = "outline",
	size = "sm",
}: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		// In a real app, this would be the actual public URL
		// For now, we mock it or use the current origin if available
		const origin = typeof window !== "undefined" ? window.location.origin : "";
		const url = `${origin}/share/${id}`;

		try {
			if (navigator.share) {
				await navigator.share({
					title: title || "Shared Translation",
					text: "Check out this simplified explanation!",
					url: url,
				});
			} else {
				await navigator.clipboard.writeText(url);
				setCopied(true);
				toast.success("Link copied to clipboard", {
					description: "Anyone with this link can view the translation.",
				});
				setTimeout(() => setCopied(false), 2000);
			}
		} catch (error) {
			console.error("Error sharing:", error);
			toast.error("Failed to share");
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={handleShare}
			title="Share translation"
		>
			{copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
			<span className="sr-only">Share</span>
		</Button>
	);
}
