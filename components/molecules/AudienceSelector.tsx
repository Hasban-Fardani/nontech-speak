import {
	Baby,
	Briefcase,
	Heart,
	type LucideIcon,
	Star,
	Users,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type AudienceType = "parent" | "partner" | "friend" | "child" | "boss";

interface AudienceSelectorProps {
	value: AudienceType;
	onChange: (value: AudienceType) => void;
}

const audiences: {
	id: AudienceType;
	label: string;
	icon: LucideIcon;
	description: string;
}[] = [
	{
		id: "parent",
		label: "Parent",
		icon: Users,
		description: "Simple analogies, no jargon.",
	},
	{
		id: "partner",
		label: "Partner",
		icon: Heart,
		description: "Conversational & relatable.",
	},
	{
		id: "friend",
		label: "Friend",
		icon: Star,
		description: "Casual & fun explanations.",
	},
	{
		id: "child",
		label: "Child",
		icon: Baby,
		description: "Very simple, like for a 5-year-old.",
	},
	{
		id: "boss",
		label: "Boss",
		icon: Briefcase,
		description: "Professional & outcome-focused.",
	},
];

export function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
	return (
		<RadioGroup
			value={value}
			onValueChange={(val) => onChange(val as AudienceType)}
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
		>
			{audiences.map((audience) => (
				<div key={audience.id}>
					<RadioGroupItem
						value={audience.id}
						id={audience.id}
						className="peer sr-only"
					/>
					<Label
						htmlFor={audience.id}
						className={cn(
							"flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all h-full",
							value === audience.id && "border-primary bg-accent",
						)}
					>
						<audience.icon className="mb-3 h-6 w-6" />
						<div className="text-center space-y-1">
							<span className="block font-semibold">{audience.label}</span>
							<span className="block text-xs text-muted-foreground font-normal">
								{audience.description}
							</span>
						</div>
					</Label>
				</div>
			))}
		</RadioGroup>
	);
}
