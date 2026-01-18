"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);
	const token = searchParams.get("token");

	useEffect(() => {
		if (!token) {
			setStatus("error");
			return;
		}

		// Verify email with token
		fetch(`/api/auth/verify-email?token=${token}`, {
			method: "POST",
		})
			.then((res) => {
				if (res.ok) {
					setStatus("success");
				} else {
					setStatus("error");
				}
			})
			.catch(() => {
				setStatus("error");
			});
	}, [token]);

	if (status === "loading") {
		return (
			<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
					Verifying your email...
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					Please wait while we verify your email address
				</p>
			</div>
		);
	}

	if (status === "success") {
		return (
			<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
				<div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg
						className="w-8 h-8 text-green-600 dark:text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Success"
					>
						<title>Success</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
					Email Verified!
				</h1>
				<p className="text-slate-600 dark:text-slate-400 mb-6">
					Your email has been successfully verified. You can now sign in to your
					account.
				</p>
				<Link
					href="/login"
					className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				>
					Go to Sign In
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
			<div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg
					className="w-8 h-8 text-red-600 dark:text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="Error"
					role="img"
				>
					<title>Error</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</div>
			<h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
				Verification Failed
			</h1>
			<p className="text-slate-600 dark:text-slate-400 mb-6">
				The verification link is invalid or has expired. Please request a new
				verification email.
			</p>
			<Link
				href="/login"
				className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
			>
				Back to Sign In
			</Link>
		</div>
	);
}

export default function VerifyEmailPage() {
	return (
		<Suspense
			fallback={
				<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
					<p>Loading...</p>
				</div>
			}
		>
			<VerifyEmailContent />
		</Suspense>
	);
}
