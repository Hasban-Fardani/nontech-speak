"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Briefcase, Coffee, Laugh } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { AudienceSelector } from "@/components/molecules/AudienceSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// API Keys Schema
const apiKeysSchema = z.object({
	geminiApiKey: z.string().optional(),
});

// Preferences Schema
const preferencesSchema = z.object({
	defaultModel: z.enum([
		"gemini-2.0-flash",
		"gemini-2.5-pro",
		"gemini-2.5-flash",
		"gemini-3-pro-preview",
		"gemini-3-flash-preview",
	] as const),
	defaultAudience: z.enum([
		"parent",
		"partner",
		"friend",
		"child",
		"boss",
	] as const),
	tone: z.enum(["professional", "casual", "funny"] as const),
	notifications: z.boolean(),
});

// Appearance Schema
const appearanceSchema = z.object({
	theme: z.enum(["light", "dark", "system"] as const),
});

type ApiKeysValues = z.infer<typeof apiKeysSchema>;
type PreferencesValues = z.infer<typeof preferencesSchema>;
type AppearanceValues = z.infer<typeof appearanceSchema>;

export function SettingsForm() {
	const [loadingApiKeys, setLoadingApiKeys] = React.useState(false);
	const [loadingPreferences, setLoadingPreferences] = React.useState(false);
	const [loadingAppearance, setLoadingAppearance] = React.useState(false);

	// Separate forms for each card
	const apiKeysForm = useForm<ApiKeysValues>({
		resolver: zodResolver(apiKeysSchema),
		defaultValues: {
			geminiApiKey: "",
		},
	});

	const preferencesForm = useForm<PreferencesValues>({
		resolver: zodResolver(preferencesSchema),
		defaultValues: {
			defaultModel: "gemini-2.0-flash",
			defaultAudience: "parent",
			tone: "casual",
			notifications: true,
		},
	});

	const appearanceForm = useForm<AppearanceValues>({
		resolver: zodResolver(appearanceSchema),
		defaultValues: {
			theme: "dark",
		},
	});

	async function onSubmitApiKeys(data: ApiKeysValues) {
		setLoadingApiKeys(true);

		try {
			const response = await fetch("/api/user/settings", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (response.ok) {
				toast.success("API Key Saved", {
					description: result.message,
				});
				// Clear the input after successful save
				apiKeysForm.reset({ geminiApiKey: "" });
			} else {
				toast.error("Failed to save", {
					description: result.error || "Please try again",
				});
			}
		} catch (_error) {
			toast.error("Error", {
				description: "Failed to save API key. Please try again.",
			});
		} finally {
			setLoadingApiKeys(false);
		}
	}

	async function onSubmitPreferences(data: PreferencesValues) {
		setLoadingPreferences(true);

		// Simulate API call for now
		setTimeout(() => {
			setLoadingPreferences(false);
			toast.success("Preferences saved", {
				description: "Your preferences have been updated successfully.",
			});
			console.log("Preferences data:", data);
		}, 1000);
	}

	async function onSubmitAppearance(data: AppearanceValues) {
		setLoadingAppearance(true);

		// Simulate API call for now
		setTimeout(() => {
			setLoadingAppearance(false);
			toast.success("Theme updated", {
				description: "Your theme preference has been saved.",
			});
			console.log("Appearance data:", data);
		}, 1000);
	}

	return (
		<div className="space-y-6">
			{/* API Configuration */}
			<Form {...apiKeysForm}>
				<form onSubmit={apiKeysForm.handleSubmit(onSubmitApiKeys)}>
					<Card>
						<CardHeader>
							<CardTitle>API Configuration</CardTitle>
							<CardDescription>
								Manage your Gemini API key to avoid quota limits.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Alert>
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									For security reasons, API keys cannot be viewed after input.
									Make sure to save your key in a secure location.
								</AlertDescription>
							</Alert>

							<FormField
								control={apiKeysForm.control}
								name="geminiApiKey"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Google Gemini API Key</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your Gemini API key"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Your API key will be encrypted and stored securely. Get
											your key from{" "}
											<a
												href="https://aistudio.google.com/app/apikey"
												target="_blank"
												rel="noopener noreferrer"
												className="underline"
											>
												Google AI Studio
											</a>
											.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={loadingApiKeys}>
								{loadingApiKeys ? "Saving..." : "Save API Key"}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>

			{/* Preferences */}
			<Form {...preferencesForm}>
				<form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)}>
					<Card>
						<CardHeader>
							<CardTitle>Preferences</CardTitle>
							<CardDescription>
								Customize your default translation experience.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8">
							<FormField
								control={preferencesForm.control}
								name="defaultModel"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Default AI Model</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a model" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="gemini-2.0-flash">
													Gemini 2.0 Flash (Fast, Default)
												</SelectItem>
												<SelectItem value="gemini-2.5-pro">
													Gemini 2.5 Pro (Powerful)
												</SelectItem>
												<SelectItem value="gemini-2.5-flash">
													Gemini 2.5 Flash (Balanced)
												</SelectItem>
												<SelectItem value="gemini-3-pro-preview">
													Gemini 3 Pro Preview (Latest, Most Powerful)
												</SelectItem>
												<SelectItem value="gemini-3-flash-preview">
													Gemini 3 Flash Preview (Latest, Fast)
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											This model will be selected by default for new
											translations.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={preferencesForm.control}
								name="defaultAudience"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-base">
											Default Audience
										</FormLabel>
										<FormDescription className="mb-4">
											Select who you usually translate for.
										</FormDescription>
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

							<FormField
								control={preferencesForm.control}
								name="tone"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-base">
											Translation Tone
										</FormLabel>
										<FormMessage />
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
										>
											{[
												{
													value: "professional",
													label: "Professional",
													icon: Briefcase,
												},
												{ value: "casual", label: "Casual", icon: Coffee },
												{ value: "funny", label: "Funny", icon: Laugh },
											].map((tone) => (
												<FormItem key={tone.value}>
													<FormLabel className="[&:has([data-state=checked])>div]:border-primary">
														<FormControl>
															<RadioGroupItem
																value={tone.value}
																className="sr-only"
															/>
														</FormControl>
														<div className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all">
															<tone.icon className="h-6 w-6 mr-3" />
															<span className="font-medium flex-1">
																{tone.label}
															</span>
														</div>
													</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
									</FormItem>
								)}
							/>

							<FormField
								control={preferencesForm.control}
								name="notifications"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Email Notifications
											</FormLabel>
											<FormDescription>
												Receive emails when new features are available.
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={loadingPreferences}>
								{loadingPreferences ? "Saving..." : "Save Preferences"}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>

			{/* Appearance */}
			<Form {...appearanceForm}>
				<form onSubmit={appearanceForm.handleSubmit(onSubmitAppearance)}>
					<Card>
						<CardHeader>
							<CardTitle>Appearance</CardTitle>
							<CardDescription>
								Select your preferred interface theme.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<FormField
								control={appearanceForm.control}
								name="theme"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormMessage />
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="grid max-w-md grid-cols-3 gap-4 pt-2"
										>
											<FormItem>
												<FormLabel className="[&:has([data-state=checked])>div]:border-primary">
													<FormControl>
														<RadioGroupItem value="light" className="sr-only" />
													</FormControl>
													<div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
														<div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
															<div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
																<div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
																<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
															</div>
															<div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
																<div className="h-4 w-4 rounded-full bg-[#ecedef]" />
																<div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
															</div>
														</div>
													</div>
													<span className="block w-full p-2 text-center font-normal">
														Light
													</span>
												</FormLabel>
											</FormItem>
											<FormItem>
												<FormLabel className="[&:has([data-state=checked])>div]:border-primary">
													<FormControl>
														<RadioGroupItem value="dark" className="sr-only" />
													</FormControl>
													<div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
														<div className="space-y-2 rounded-sm bg-slate-950 p-2">
															<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
																<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
																<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
															</div>
															<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
																<div className="h-4 w-4 rounded-full bg-slate-400" />
																<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
															</div>
														</div>
													</div>
													<span className="block w-full p-2 text-center font-normal">
														Dark
													</span>
												</FormLabel>
											</FormItem>
											<FormItem>
												<FormLabel className="[&:has([data-state=checked])>div]:border-primary">
													<FormControl>
														<RadioGroupItem
															value="system"
															className="sr-only"
														/>
													</FormControl>
													<div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
														<div className="space-y-2 rounded-sm bg-slate-950 p-2">
															<div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
																<div className="h-2 w-[80px] rounded-lg bg-slate-400" />
																<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
															</div>
															<div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
																<div className="h-4 w-4 rounded-full bg-slate-400" />
																<div className="h-2 w-[100px] rounded-lg bg-slate-400" />
															</div>
														</div>
													</div>
													<span className="block w-full p-2 text-center font-normal">
														System
													</span>
												</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={loadingAppearance}>
								{loadingAppearance ? "Saving..." : "Save Theme"}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>
	);
}
