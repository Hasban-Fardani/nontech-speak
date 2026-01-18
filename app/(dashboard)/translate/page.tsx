import { TranslationForm } from "@/components/organisms/TranslationForm";

export default function TranslatePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-slate-50/50 md:min-h-min dark:bg-slate-900/50">
        <div className="p-6">
           <TranslationForm />
        </div>
      </div>
    </div>
  );
}
