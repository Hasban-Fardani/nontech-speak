'use client';

import { useSession } from '@/lib/auth-client';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = [
    { label: 'Translations', value: '0', icon: '🔄', color: 'blue' },
    { label: 'Practice Sessions', value: '0', icon: '🎯', color: 'green' },
    { label: 'Saved Examples', value: '0', icon: '📚', color: 'purple' },
    { label: 'Average Score', value: '-', icon: '⭐', color: 'yellow' },
  ];

  const quickActions = [
    {
      title: 'New Translation',
      description: 'Simplify technical concepts',
      href: '/dashboard/translate',
      icon: '🔄',
      color: 'blue',
    },
    {
      title: 'Practice Mode',
      description: 'Improve your explanations',
      href: '/dashboard/practice',
      icon: '🎯',
      color: 'green',
    },
    {
      title: 'Browse Library',
      description: 'Explore public examples',
      href: '/dashboard/library',
      icon: '📚',
      color: 'purple',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
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
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
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
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
            >
              <div className="text-4xl mb-4">{action.icon}</div>
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
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No activity yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Start by creating your first translation or practice session
          </p>
          <Link
            href="/dashboard/translate"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
