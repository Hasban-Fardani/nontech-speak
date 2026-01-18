"use client";

import {
	Activity as ActivityIcon,
	BookOpen,
	Languages,
	Library,
	Sparkles,
	Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

interface DashboardStats {
	translations: number;
	practiceSessions: number;
	savedExamples: number;
	averageScore: number;
}

interface Activity {
	id: string;
	type: "translation" | "practice";
	title: string;
	audience?: string;
	score?: number;
	createdAt: Date | string;
}

export default function DashboardPage() {
	const { data: session } = useSession();
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [activity, setActivity] = useState<Activity[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchDashboardData() {
			try {
				// Fetch stats
				const statsResponse = await api.api.dashboard.stats.get();
				if (statsResponse.data && !("error" in statsResponse.data)) {
					setStats(statsResponse.data as DashboardStats);
				}

				// Fetch recent activity
				const activityResponse = await api.api.dashboard.activity.get({
					query: { limit: "5" },
				});
				if (activityResponse.data && Array.isArray(activityResponse.data)) {
					setActivity(activityResponse.data as unknown as Activity[]);
				}
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchDashboardData();
	}, []);

	const statsCards = [
		{
			label: "Translations",
			value: loading ? "..." : stats?.translations.toString() || "0",
			icon: Languages,
			color: "blue",
		},
		{
			label: "Practice Sessions",
			value: loading ? "..." : stats?.practiceSessions.toString() || "0",
			icon: Target,
			color: "green",
		},
		{
			label: "Saved Examples",
			value: loading ? "..." : stats?.savedExamples.toString() || "0",
			icon: Library,
			color: "purple",
		},
		{
			label: "Average Score",
			value: loading
				? "..."
				: stats?.averageScore
					? `${stats.averageScore}%`
					: "-",
			icon: ActivityIcon,
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
				{statsCards.map((stat) => (
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

			{/* Recent activity */}
			<div>
				<h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
					Recent Activity
				</h2>
				{loading ? (
					<div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-slate-200 dark:border-slate-800 text-center">
						<p className="text-slate-600 dark:text-slate-400">Loading...</p>
					</div>
				) : activity.length === 0 ? (
					<div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-slate-200 dark:border-slate-800 text-center">
						<div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
							<ActivityIcon className="h-8 w-8 text-slate-400" />
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
				) : (
					<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
						{activity.map((item) => (
							<Link
								key={item.id}
								href={
									item.type === "translation"
										? `/history/${item.id}`
										: `/practice/${item.id}`
								}
								className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											{item.type === "translation" ? (
												<Languages className="h-4 w-4 text-blue-600" />
											) : (
												<Target className="h-4 w-4 text-green-600" />
											)}
											<span className="text-sm font-medium text-slate-900 dark:text-white">
												{item.type === "translation"
													? "Translation"
													: "Practice Session"}
											</span>
											{item.score !== undefined && (
												<span className="text-sm text-green-600 font-medium">
													{item.score}%
												</span>
											)}
										</div>
										<p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
											{item.title}
										</p>
										{item.audience && (
											<span className="inline-block mt-1 text-xs text-slate-500 dark:text-slate-500 capitalize">
												{item.audience}
											</span>
										)}
									</div>
									<span className="text-xs text-slate-500 dark:text-slate-500 ml-4">
										{new Date(item.createdAt).toLocaleDateString()}
									</span>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
