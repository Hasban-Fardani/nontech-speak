"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Loader2, Mail, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type PasswordValues = z.infer<typeof passwordSchema>;

export function AccountSettings() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);

	const form = useForm<PasswordValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	function onSubmit(_data: PasswordValues) {
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			setLoading(false);
			toast.success("Password updated", {
				description: "Your password has been changed successfully.",
			});
			form.reset();
		}, 1500);
	}

	return (
		<div className="space-y-6">
			{/* Profile Card */}
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
					<CardDescription>Your personal information.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-4">
						<div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
							{session?.user?.image ? (
								<Image
									src={session.user.image}
									alt="Profile"
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							) : (
								<User className="h-8 w-8 text-muted-foreground" />
							)}
						</div>
						<div>
							<h4 className="font-semibold text-lg">
								{session?.user?.name || "User"}
							</h4>
							<p className="text-sm text-muted-foreground flex items-center gap-1">
								<Mail className="h-3 w-3" />{" "}
								{session?.user?.email || "user@example.com"}
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="border-t bg-muted/50 px-6 py-4">
					<Button variant="outline" size="sm">
						Edit Profile
					</Button>
				</CardFooter>
			</Card>

			{/* Linked Accounts */}
			<Card>
				<CardHeader>
					<CardTitle>Linked Accounts</CardTitle>
					<CardDescription>
						Manage your connections to external services.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="flex items-center gap-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
								<Github className="h-5 w-5" />
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium leading-none">GitHub</p>
								<p className="text-xs text-muted-foreground">
									{/* Logic to determine if connected - mocking based on session user image typically from github or provider info */}
									{session?.user?.image?.includes("github")
										? `Connected as ${session.user.name}`
										: "Connect your GitHub account"}
								</p>
							</div>
						</div>
						{session?.user?.image?.includes("github") ? (
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
							>
								Connected
							</Badge>
						) : (
							<Button variant="outline" size="sm">
								Connect
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Password Update */}
			<Card>
				<CardHeader>
					<CardTitle>Update Password</CardTitle>
					<CardDescription>
						Change your account password securely.
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="••••••••"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
						<CardFooter className="border-t bg-muted/50 px-6 py-4">
							<Button type="submit" disabled={loading}>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Update Password
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
