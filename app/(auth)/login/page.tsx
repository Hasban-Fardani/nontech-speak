import { LoginForm } from "@/components/organisms/LoginForm";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/translate');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
