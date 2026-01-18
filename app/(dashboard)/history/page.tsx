import { HistoryList } from "@/components/organisms/HistoryList"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "History | NonTechSpeak",
  description: "View your past translations",
}

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">
          Your past translations and simplified explanations.
        </p>
      </div>
      
      <HistoryList />
    </div>
  )
}
