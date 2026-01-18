import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "NonTechSpeak - Simplify Technical Concepts",
	description:
		"Transform complex technical jargon into simple, understandable language for any audience",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${inter.className} antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
