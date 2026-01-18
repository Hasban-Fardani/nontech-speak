import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/organisms/RegisterForm";
import { auth } from "@/server/auth";

export default async function RegisterPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/translate");
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
			<RegisterForm />
		</div>
	);
}
