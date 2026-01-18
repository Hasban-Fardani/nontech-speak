"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Check, Copy, Mic, Sparkles, Type } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
	AudienceSelector,
	AudienceType,
} from "@/components/molecules/AudienceSelector";
import { AudioRecorder } from "@/components/molecules/AudioRecorder";
import { AudioUploader } from "@/components/molecules/AudioUploader";
import { ShareButton } from "@/components/molecules/ShareButton";
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";

const translationSchema = z.object({
	technicalText: z
		.string()
		.min(10, "Text must be at least 10 characters")
		.max(5000),
	audienceType: z.enum(["parent", "partner", "friend", "child"] as const),
	model: z.enum(["gemini-1.5-pro", "gpt-4o", "claude-3-5-sonnet"] as const),
});

type TranslationValues = z.infer<typeof translationSchema>;

export function TranslationForm() {
	const [loading, setLoading] = React.useState(false);
	const [result, setResult] = React.useState<string | null>(null);
	const [copied, setCopied] = React.useState(false);
	const [inputType, setInputType] = React.useState<"text" | "audio" | "file">(
		"text",
	);
	const [isPublic, setIsPublic] = React.useState(false);

	const form = useForm<TranslationValues>({
		resolver: zodResolver(translationSchema),
		defaultValues: {
			technicalText: "",
			audienceType: "parent",
			model: "gemini-1.5-pro",
		},
	});

	async function onSubmit(data: TranslationValues) {
		if (inputType !== "text") {
			toast.info("Audio translation is coming soon!", {
				description: "This feature is currently in development.",
			});
			return;
		}

		setLoading(true);
		setResult(null);

		try {
			const response = await api.api.translation.create.post({
				technicalText: data.technicalText,
				audienceType: data.audienceType,
			});

			if (response.error) {
				const errorValue = response.error.value;
				let errorMessage = "Translation failed";

				if (typeof errorValue === "string") {
					errorMessage = errorValue;
				} else if (
					typeof errorValue === "object" &&
					errorValue !== null &&
					"message" in errorValue
				) {
					errorMessage = (errorValue as any).message;
				} else {
					errorMessage = JSON.stringify(errorValue);
				}

				// Show specific error messages
				if (errorMessage.includes("quota") || errorMessage.includes("429")) {
					toast.error(
						"API quota exceeded. Please try again in a few moments.",
						{
							description:
								"You've reached the free tier limit. Consider upgrading or wait a bit.",
						},
					);
				} else if (errorMessage.includes("Unauthorized")) {
					toast.error("Session expired. Please login again.");
				} else {
					toast.error(errorMessage);
				}
				return;
			}

			if (response.data?.success && response.data.data) {
				setResult(response.data.data.simplifiedText);
				toast.success("Translation complete!", {
					description: `Translated using ${data.model} (Mock)`,
				});
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred during translation", {
				description: "Please check your connection and try again.",
			});
		} finally {
			setLoading(false);
		}
	}

	const copyToClipboard = () => {
		if (result) {
			navigator.clipboard.writeText(result);
			setCopied(true);
			toast.info("Copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card className="h-full flex flex-col">
				<CardHeader>
					<CardTitle>Original Content</CardTitle>
					<CardDescription>
						Choose how you want to provide the technical explanation.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-1">
					<Tabs
						defaultValue="text"
						className="w-full flex-1 flex flex-col"
						onValueChange={(v: string) =>
							setInputType(v as "text" | "audio" | "file")
						}
					>
						<TabsList className="grid w-full grid-cols-2 mb-4">
							<TabsTrigger value="text" className="flex items-center gap-2">
								<Type className="h-4 w-4" />
								Text Input
							</TabsTrigger>
							<TabsTrigger value="audio" className="flex items-center gap-2">
								<Mic className="h-4 w-4" />
								Audio Input
							</TabsTrigger>
						</TabsList>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								id="translation-form"
								className="space-y-6 flex-1 flex flex-col"
							>
								{/* Model Selector */}
								<div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg border border-dashed">
									<Bot className="h-4 w-4 text-muted-foreground" />
									<FormField
										control={form.control}
										name="model"
										render={({ field }) => (
											<FormItem className="flex-1 space-y-0">
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="h-8 bg-transparent border-0 focus:ring-0 px-2 shadow-none">
															<SelectValue placeholder="Select AI Model" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="gemini-1.5-pro">
															Gemini 1.5 Pro
														</SelectItem>
														<SelectItem value="gpt-4o">GPT-4o</SelectItem>
														<SelectItem value="claude-3-5-sonnet">
															Claude 3.5 Sonnet
														</SelectItem>
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>
								</div>

								<TabsContent
									value="text"
									className="mt-0 flex-1 flex flex-col space-y-4"
								>
									<FormField
										control={form.control}
										name="technicalText"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormControl>
													<Textarea
														placeholder="e.g., Kubernetes is a container orchestration system for automating application deployment..."
														className="min-h-[150px] h-full resize-none p-4 text-base"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent
									value="audio"
									className="mt-0 flex-1 flex flex-col justify-center space-y-6"
								>
									<Tabs defaultValue="record" className="w-full">
										<TabsList className="w-full grid grid-cols-2 w-[200px] mx-auto mb-6">
											<TabsTrigger
												value="record"
												onClick={() => setInputType("audio")}
											>
												Record
											</TabsTrigger>
											<TabsTrigger
												value="upload"
												onClick={() => setInputType("file")}
											>
												Upload
											</TabsTrigger>
										</TabsList>

										<TabsContent value="record" className="mt-0">
											<AudioRecorder
												onRecordingComplete={(blob) => {
													console.log("Recorded blob:", blob);
													toast.success("Audio recorded!", {
														description: "Ready to translate (Mock)",
													});
												}}
											/>
										</TabsContent>

										<TabsContent value="upload" className="mt-0">
											<AudioUploader
												onFileSelect={(file) => {
													console.log("Selected file:", file);
													toast.success("File selected!", {
														description: file.name,
													});
												}}
											/>
										</TabsContent>
									</Tabs>

									<div className="p-4 bg-muted/50 rounded-lg text-sm text-center text-muted-foreground">
										<p>
											Audio translation supports continuous speech up to 2
											minutes.
										</p>
									</div>
								</TabsContent>

								<div className="pt-4 mt-auto">
									<FormField
										control={form.control}
										name="audienceType"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base">
													Target Audience
												</FormLabel>
												<FormControl>
													<AudienceSelector
														value={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</form>
						</Form>
					</Tabs>
				</CardContent>
				<CardFooter className="flex-col gap-4">
					<div className="flex items-center space-x-2 w-full p-4 bg-muted/30 rounded-lg border border-dashed">
						<Switch
							id="public-mode"
							checked={isPublic}
							onCheckedChange={setIsPublic}
						/>
						<Label htmlFor="public-mode" className="flex-1 cursor-pointer">
							<span className="font-medium block">Contribute to Community</span>
							<span className="font-normal text-muted-foreground text-xs">
								Make this translation public on the landing page
							</span>
						</Label>
					</div>

					<Button
						type="submit"
						form="translation-form"
						className="w-full"
						size="lg"
						disabled={loading}
					>
						{loading ? (
							<>
								<Sparkles className="mr-2 h-4 w-4 animate-spin" />
								Translating...
							</>
						) : (
							<>
								<Sparkles className="mr-2 h-4 w-4" />
								Translate {inputType === "text" ? "Text" : "Audio"}
							</>
						)}
					</Button>
				</CardFooter>
			</Card>

			<Card className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-dashed">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Simplified Explanation</CardTitle>
						<div className="flex items-center gap-2">
							{result && (
								<>
									<ShareButton id={Math.random().toString(36).substring(7)} />
									<Button variant="ghost" size="sm" onClick={copyToClipboard}>
										{copied ? (
											<Check className="h-4 w-4 mr-2" />
										) : (
											<Copy className="h-4 w-4 mr-2" />
										)}
										{copied ? "Copied" : "Copy"}
									</Button>
								</>
							)}
						</div>
					</div>
					<CardDescription>
						The non-tech friendly version will appear here.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-1">
					{result ? (
						<div className="prose dark:prose-invert max-w-none p-4 rounded-lg bg-white dark:bg-black border">
							<p className="whitespace-pre-wrap text-lg leading-relaxed">
								{result}
							</p>
						</div>
					) : (
						<div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4 min-h-[200px]">
							<Sparkles className="h-12 w-12" />
							<p>Ready to translate...</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
