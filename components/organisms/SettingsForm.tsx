"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Coffee, Eye, EyeOff, Laugh } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { AudienceSelector } from "@/components/molecules/AudienceSelector";
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

const settingsSchema = z.object({
	// API Keys
	googleApiKey: z.string().optional(),
	openaiApiKey: z.string().optional(),
	anthropicApiKey: z.string().optional(),

	// Preferences
	defaultModel: z.enum([
		"gemini-1.5-pro",
		"gpt-4o",
		"claude-3-5-sonnet",
	] as const),
	defaultAudience: z.enum(["parent", "partner", "friend", "child"] as const),
	tone: z.enum(["professional", "casual", "funny"] as const),
	notifications: z.boolean(),

	// Appearance
	theme: z.enum(["light", "dark", "system"] as const),
});

type SettingsValues = z.infer<typeof settingsSchema>;

// Mock default values
const defaultValues: SettingsValues = {
	googleApiKey: "sk-proj-**********************",
	openaiApiKey: "",
	anthropicApiKey: "",
	defaultModel: "gemini-1.5-pro",
	defaultAudience: "parent",
	tone: "casual",
	theme: "dark",
	notifications: true,
};

export function SettingsForm() {
	const [showGoogleKey, setShowGoogleKey] = React.useState(false);
	const [showOpenAiKey, setShowOpenAiKey] = React.useState(false);
	const [showAnthropicKey, setShowAnthropicKey] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const form = useForm<SettingsValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues,
	});

	function onSubmit(data: SettingsValues) {
		setLoading(true);

		// Simulate API call
		setTimeout(() => {
			setLoading(false);
			toast.success("Settings saved", {
				description: "Your preferences have been updated successfully.",
			});
			console.log("Settings data:", data);
		}, 1000);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Account Settings */}
				<Card>
					<CardHeader>
						<CardTitle>API Configuration</CardTitle>
						<CardDescription>
							Manage your API keys for different AI providers.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Google Gemini */}
						<FormField
							control={form.control}
							name="googleApiKey"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Google Gemini API Key</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showGoogleKey ? "text" : "password"}
												placeholder="Enter your Gemini API key"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowGoogleKey(!showGoogleKey)}
											>
												{showGoogleKey ? (
													<EyeOff className="h-4 w-4 text-muted-foreground" />
												) : (
													<Eye className="h-4 w-4 text-muted-foreground" />
												)}
												<span className="sr-only">Toggle visibility</span>
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* OpenAI */}
						<FormField
							control={form.control}
							name="openaiApiKey"
							render={({ field }) => (
								<FormItem>
									<FormLabel>OpenAI API Key</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showOpenAiKey ? "text" : "password"}
												placeholder="sk-..."
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowOpenAiKey(!showOpenAiKey)}
											>
												{showOpenAiKey ? (
													<EyeOff className="h-4 w-4 text-muted-foreground" />
												) : (
													<Eye className="h-4 w-4 text-muted-foreground" />
												)}
												<span className="sr-only">Toggle visibility</span>
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Anthropic */}
						<FormField
							control={form.control}
							name="anthropicApiKey"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Anthropic API Key</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showAnthropicKey ? "text" : "password"}
												placeholder="sk-ant-..."
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowAnthropicKey(!showAnthropicKey)}
											>
												{showAnthropicKey ? (
													<EyeOff className="h-4 w-4 text-muted-foreground" />
												) : (
													<Eye className="h-4 w-4 text-muted-foreground" />
												)}
												<span className="sr-only">Toggle visibility</span>
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Preferences */}
				<Card>
					<CardHeader>
						<CardTitle>Preferences</CardTitle>
						<CardDescription>
							Customize your default translation experience.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8">
						<FormField
							control={form.control}
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
											<SelectItem value="gemini-1.5-pro">
												Gemini 1.5 Pro (Google)
											</SelectItem>
											<SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
											<SelectItem value="claude-3-5-sonnet">
												Claude 3.5 Sonnet (Anthropic)
											</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription>
										This model will be selected by default for new translations.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="defaultAudience"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-base">Default Audience</FormLabel>
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
							control={form.control}
							name="tone"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-base">Translation Tone</FormLabel>
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
							control={form.control}
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
				</Card>

				{/* Appearance */}
				<Card>
					<CardHeader>
						<CardTitle>Appearance</CardTitle>
						<CardDescription>
							Select your preferred interface theme.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
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
													<RadioGroupItem value="system" className="sr-only" />
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
						<Button type="submit" disabled={loading} size="lg">
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
