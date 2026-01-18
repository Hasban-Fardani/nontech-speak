"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { PasswordInput } from "@/components/molecules/PasswordInput";
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
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);

	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginValues) {
		setLoading(true);
		try {
			await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
					callbackURL: "/dashboard",
				},
				{
					onSuccess: () => {
						toast.success("Logged in successfully");
						router.push("/dashboard");
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
						setLoading(false);
					},
				},
			);
		} catch (_error) {
			toast.error("Something went wrong");
			setLoading(false);
		}
	}

	async function handleGithubLogin() {
		setLoading(true);
		await authClient.signIn.social(
			{
				provider: "github",
				callbackURL: "/dashboard",
			},
			{
				onSuccess: () => {},
				onError: (ctx) => {
					toast.error(ctx.error.message);
					setLoading(false);
				},
			},
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Welcome back</CardTitle>
				<CardDescription>
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="m@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder="••••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>
				</Form>
				<div className="relative my-4">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>
				<Button
					variant="outline"
					type="button"
					disabled={loading}
					className="w-full"
					onClick={handleGithubLogin}
				>
					<Github className="mr-2 h-4 w-4" />
					GitHub
				</Button>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Button
						variant="link"
						className="p-0"
						onClick={() => router.push("/register")}
					>
						Sign up
					</Button>
				</p>
			</CardFooter>
		</Card>
	);
}
