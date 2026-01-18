import { ArrowRight, Bot, Brain, Lock, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { PublicFeed } from "@/components/organisms/PublicFeed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
				<Link className="flex items-center justify-center" href="/">
					<div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">
						N
					</div>
					<span className="font-bold text-xl">Non-Tech Speak</span>
				</Link>
				<nav className="ml-auto flex gap-4 sm:gap-6">
					<Link
						className="text-sm font-medium hover:underline underline-offset-4 flex items-center"
						href="/login"
					>
						Sign In
					</Link>
					<Link href="/register">
						<Button size="sm">Get Started</Button>
					</Link>
				</nav>
			</header>

			<main className="flex-1">
				{/* Hero Section */}
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
					<div className="absolute inset-0 z-0">
						<div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
						<div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
					</div>

					<div className="container relative z-10 px-4 md:px-6 mx-auto">
						<div className="flex flex-col items-center space-y-4 text-center">
							<Badge
								variant="secondary"
								className="px-3 py-1 rounded-full text-sm font-medium mb-2"
							>
								<Sparkles className="w-3 h-3 mr-1 inline" /> AI-Powered
								Translation
							</Badge>
							<h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
								Turn Jargon into <br className="hidden md:inline" />
								Plain English
							</h1>
							<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 leading-relaxed">
								Stop confusing your parents, partners, and friends. Instantly
								translate complex technical concepts into simple analogies
								anyone can understand.
							</p>
							<div className="space-x-4 pt-4">
								<Link href="/register">
									<Button
										size="lg"
										className="h-12 px-8 rounded-full text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
									>
										Start Translating <ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
								<Link href="/login">
									<Button
										variant="outline"
										size="lg"
										className="h-12 px-8 rounded-full text-base"
									>
										Log In
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Designed for Developers
							</h2>
							<p className="mx-auto max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400 mt-4">
								We handle the complexity so you can focus on communication.
							</p>
						</div>
						<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
							<Card className="bg-background border-none shadow-md hover:shadow-xl transition-shadow duration-300">
								<CardContent className="p-6 flex flex-col items-center text-center space-y-4">
									<div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
										<Users className="h-8 w-8" />
									</div>
									<h3 className="text-xl font-bold">Audience Tailored</h3>
									<p className="text-muted-foreground">
										Customize explanations for parents, partners, friends, or
										even children. The AI adjusts typography and analogies.
									</p>
								</CardContent>
							</Card>
							<Card className="bg-background border-none shadow-md hover:shadow-xl transition-shadow duration-300">
								<CardContent className="p-6 flex flex-col items-center text-center space-y-4">
									<div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
										<Brain className="h-8 w-8" />
									</div>
									<h3 className="text-xl font-bold">Smart Analogies</h3>
									<p className="text-muted-foreground">
										Our AI doesn't just simplify words; it finds perfect
										real-world analogies to explain abstract concepts.
									</p>
								</CardContent>
							</Card>
							<Card className="bg-background border-none shadow-md hover:shadow-xl transition-shadow duration-300">
								<CardContent className="p-6 flex flex-col items-center text-center space-y-4">
									<div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400">
										<Bot className="h-8 w-8" />
									</div>
									<h3 className="text-xl font-bold">Gemini Powered</h3>
									<p className="text-muted-foreground">
										Leveraging Google's advanced Gemini 2.0 Flash model for
										lightning-fast and accurate translations.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="flex flex-col items-center space-y-4 text-center max-w-3xl mx-auto">
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Ready to bridge the gap?
							</h2>
							<p className="text-gray-500 md:text-xl dark:text-gray-400">
								Join hundreds of developers who are finally making themselves
								understood.
							</p>
							<div className="pt-4">
								<Link href="/register">
									<Button
										size="lg"
										className="h-12 px-8 rounded-full text-base"
									>
										Get Started for Free
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>

			<PublicFeed />

			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-gray-500 dark:text-gray-400">
					© 2024 Non-Tech Speak. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Terms of Service
					</Link>
					<Link className="text-xs hover:underline underline-offset-4" href="#">
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
