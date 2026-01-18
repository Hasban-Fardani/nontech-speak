"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "@/components/molecules/ModeToggle";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function PublicHeader() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const isActive = (path: string) => pathname === path;

	const NavClass = (path: string) =>
		`text-sm font-medium hover:text-primary transition-colors ${
			isActive(path) ? "text-primary" : "text-muted-foreground"
		}`;

	return (
		<header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<Link className="flex items-center justify-center" href="/">
				<Image
					src="/logo/ns-bg-transparant.png"
					alt="Non-Tech Speak Logo"
					width={32}
					height={32}
					className="h-8 w-8 mr-2"
				/>
				<span className="font-bold text-xl">Non-Tech Speak</span>
			</Link>

			{/* Desktop Nav */}
			<nav className="ml-8 hidden md:flex gap-6">
				<Link className={NavClass("/library")} href="/library">
					Libraries
				</Link>
				<Link className={NavClass("/rankings")} href="/rankings">
					Leaderboard
				</Link>
			</nav>

			<nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
				<ModeToggle />
				<Link
					className="text-sm font-medium hover:underline underline-offset-4 flex items-center text-muted-foreground hover:text-foreground"
					href="/login"
				>
					Sign In
				</Link>
				<Link href="/register">
					<Button size="sm">Get Started</Button>
				</Link>
			</nav>

			{/* Mobile Nav */}
			<div className="ml-auto md:hidden">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle className="text-left flex items-center gap-2">
								<Image
									src="/logo/ns-bg-transparant.png"
									alt="Non-Tech Speak Logo"
									width={24}
									height={24}
									className="h-6 w-6"
								/>
								Menu
							</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col gap-6 mt-8">
							<nav className="flex flex-col gap-4">
								<Link
									className={NavClass("/library")}
									href="/library"
									onClick={() => setOpen(false)}
								>
									Libraries
								</Link>
								<Link
									className={NavClass("/rankings")}
									href="/rankings"
									onClick={() => setOpen(false)}
								>
									Leaderboard
								</Link>
							</nav>
							<div className="flex flex-col gap-4 mt-auto">
								<Link href="/login" onClick={() => setOpen(false)}>
									<Button variant="outline" className="w-full justify-start">
										Sign In
									</Button>
								</Link>
								<Link href="/register" onClick={() => setOpen(false)}>
									<Button className="w-full">Get Started</Button>
								</Link>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
