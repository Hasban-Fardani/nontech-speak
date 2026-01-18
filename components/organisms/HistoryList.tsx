"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar, ArrowRight, Sparkles } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// TODO: Replace with actual type from Drizzle schema
type HistoryItem = {
  id: string
  originalText: string
  translatedText: string
  audience: "child" | "teenager" | "adult" | "expert" | "parent" | "partner" | "friend"
  createdAt: Date
}

// TODO: Remove this dummy data when connecting to backend
const DUMMY_HISTORY: HistoryItem[] = [
  {
    id: "1",
    originalText: "Kubernetes is a container orchestration system for automating application deployment, scaling, and management.",
    translatedText: "Think of Kubernetes like a manager at a busy shipping port. Instead of workers moving boxes (containers) manually, this manager automatically decides where every box goes, how many workers are needed, and makes sure everything runs smoothly without crashing.",
    audience: "friend",
    createdAt: new Date("2024-03-10T10:00:00"),
  },
  {
    id: "2",
    originalText: "The CAP theorem states that a distributed data store can only provide two of the following three guarantees: Consistency, Availability, and Partition Tolerance.",
    translatedText: "Imagine you run a phone network. You want it to always work (Availability), give everyone the same info (Consistency), and handle broken cables (Partition Tolerance). The rule says you can't have all three perfectly at the same time; you have to pick the two that matter most.",
    audience: "child",
    createdAt: new Date("2024-03-09T15:30:00"),
  },
  {
    id: "3",
    originalText: "Dependency injection is a design pattern in which an object or function receives other objects or functions that it depends on.",
    translatedText: "Instead of building your own tools every time you want to fix a car, someone hands you the exact wrench you need right when you need it. That way, you just focus on fixing the car, not making the tools.",
    audience: "parent",
    createdAt: new Date("2024-03-08T09:15:00"),
  },
]

export function HistoryList() {
  // TODO: Fetch data from backend API
  // const { data: history, isLoading } = useQuery(...)
  const history = DUMMY_HISTORY

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <Card key={item.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="capitalize">
                  {item.audience}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {format(item.createdAt, "MMM d, yyyy")}
                </div>
              </div>
              <CardTitle className="text-base line-clamp-2 leading-tight">
                {item.originalText}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="text-sm text-muted-foreground line-clamp-4">
                <div className="flex items-center gap-2 mb-2 text-primary/80 font-medium">
                  <Sparkles className="h-3 w-3" />
                  <span>Simplified:</span>
                </div>
                {item.translatedText}
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-slate-50 dark:bg-slate-900/50">
              <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-transparent hover:text-primary">
                View Details <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
