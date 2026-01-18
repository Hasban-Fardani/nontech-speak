"use client";

import {
	Activity,
	BookOpen,
	Languages,
	Library,
	Sparkles,
	Target,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
	const { data: session } = useSession();

	const stats = [
		{
			label: "Translations",
			value: "0",
			icon: Languages,
			color: "blue",
		},
		{
			label: "Practice Sessions",
			value: "0",
			icon: Target,
			color: "green",
		},
		{
			label: "Saved Examples",
			value: "0",
			icon: Library,
			color: "purple",
		},
		{
			label: "Average Score",
			value: "-",
			icon: Activity,
			color: "yellow",
		},
	];

	const quickActions = [
		{
			title: "New Translation",
			description: "Simplify technical concepts",
			href: "/translate",
			icon: Sparkles,
			color: "blue",
		},
		{
			title: "Practice Mode",
			description: "Improve your explanations",
			href: "/practice",
			icon: Target,
			color: "green",
		},
		{
			title: "Browse Library",
			description: "Explore public examples",
			href: "/library",
			icon: BookOpen,
			color: "purple",
		},
	];

	return (
		<div className="space-y-4">
			{/* Welcome section */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
					Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Ready to simplify some technical concepts today?
				</p>
			</div>

			{/* Stats grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
					>
						<div className="flex items-center justify-between mb-2">
							<div
								className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}
							>
								<stat.icon className="h-6 w-6" />
							</div>
							<span
								className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}
							>
								{stat.value}
							</span>
						</div>
						<p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
							{stat.label}
						</p>
					</div>
				))}
			</div>

			{/* Quick actions */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{quickActions.map((action) => (
						<Link
							key={action.title}
							href={action.href}
							className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md group"
						>
							<div
								className={`text-${action.color}-600 dark:text-${action.color}-400 mb-4`}
							>
								<action.icon className="h-8 w-8" />
							</div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
								{action.title}
							</h3>
							<p className="text-sm text-slate-600 dark:text-slate-400">
								{action.description}
							</p>
						</Link>
					))}
				</div>
			</div>

			{/* Recent activity placeholder */}
			<div>
				<h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
					Recent Activity
				</h2>
				<div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-slate-200 dark:border-slate-800 text-center">
					<div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
						<Activity className="h-8 w-8 text-slate-400" />
					</div>
					<h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
						No activity yet
					</h3>
					<p className="text-slate-600 dark:text-slate-400 mb-6">
						Start by creating your first translation or practice session
					</p>
					<Link
						href="/translate"
						className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
					>
						Get Started
					</Link>
				</div>
			</div>
		</div>
	);
}
