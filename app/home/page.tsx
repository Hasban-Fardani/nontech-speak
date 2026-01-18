import { auth } from '@/server/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TranslationForm } from '@/components/organisms/TranslationForm';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import SignOutButton from '@/components/molecules/SignOutButton';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black">
      <header className="bg-white dark:bg-slate-950 border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
           <span className="font-bold text-xl">Non-Tech Speak</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm text-muted-foreground hidden md:inline-block">Welcome, {session.user.name}</span>
           <SignOutButton />
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Translation Studio</h1>
          <p className="text-muted-foreground">
            Convert technical documentation into human-readable explanations.
          </p>
        </div>
        
        <TranslationForm />
      </main>
    </div>
  );
}
