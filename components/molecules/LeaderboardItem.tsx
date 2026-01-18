import { Crown, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type LeaderboardEntry = {
	rank: number;
	user: {
		id: string;
		name: string;
		avatar: string;
		initials: string;
	};
	xp: number;
	isCurrentUser?: boolean;
};

interface LeaderboardItemProps {
	entry: LeaderboardEntry;
	className?: string;
}

export function LeaderboardItem({ entry, className }: LeaderboardItemProps) {
	return (
		<div
			className={`flex items-center justify-between p-4 rounded-lg border ${
				entry.isCurrentUser
					? "bg-slate-50 border-primary/50 dark:bg-slate-900"
					: "bg-card"
			} ${className}`}
		>
			<div className="flex items-center gap-4">
				<div
					className={`
            flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg
            ${entry.rank === 1 ? "text-yellow-500" : ""}
            ${entry.rank === 2 ? "text-slate-400" : ""}
            ${entry.rank === 3 ? "text-amber-600" : ""}
            ${entry.rank > 3 ? "text-muted-foreground" : ""}
          `}
				>
					{entry.rank <= 3 ? <Medal className="h-6 w-6" /> : entry.rank}
				</div>
				<Avatar className="h-10 w-10 border">
					<AvatarImage src={entry.user.avatar} />
					<AvatarFallback>{entry.user.initials}</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-medium lead-none">
						{entry.user.name}
						{entry.isCurrentUser && (
							<Badge variant="secondary" className="ml-2 text-xs">
								You
							</Badge>
						)}
					</p>
					{entry.rank <= 3 && (
						<p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
							<Crown className="w-3 h-3 text-yellow-500" /> Top Contributor
						</p>
					)}
				</div>
			</div>
			<div className="text-right">
				<div className="font-bold text-lg">{entry.xp.toLocaleString()} XP</div>
			</div>
		</div>
	);
}
