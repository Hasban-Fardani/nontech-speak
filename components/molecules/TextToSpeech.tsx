"use client";

import { Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TextToSpeechProps {
	text: string;
	className?: string;
}

export function TextToSpeech({ text, className }: TextToSpeechProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			setIsSupported(true);
		}
	}, []);

	useEffect(() => {
		// Cancel speech if unmounted
		return () => {
			if (typeof window !== "undefined" && window.speechSynthesis) {
				window.speechSynthesis.cancel();
			}
		};
	}, []);

	const handlePlay = () => {
		if (!isSupported) {
			toast.error("Text-to-speech is not supported in this browser");
			return;
		}

		if (isPlaying) {
			window.speechSynthesis.cancel();
			setIsPlaying(false);
			return;
		}

		const utterance = new SpeechSynthesisUtterance(text);
		utteranceRef.current = utterance;

		// Improve voice selection if possible
		// const voices = window.speechSynthesis.getVoices()
		// const preferredVoice = voices.find(v => v.lang.includes('en')) // Default to English for now
		// if (preferredVoice) utterance.voice = preferredVoice

		utterance.onend = () => {
			setIsPlaying(false);
		};

		utterance.onerror = (e) => {
			console.error("Speech error:", e);
			setIsPlaying(false);
			toast.error("Failed to play audio");
		};

		window.speechSynthesis.speak(utterance);
		setIsPlaying(true);
	};

	if (!isSupported) return null;

	return (
		<Button
			variant="outline"
			size="sm"
			className={className}
			onClick={handlePlay}
			title={isPlaying ? "Stop listening" : "Listen to translation"}
		>
			{isPlaying ? (
				<>
					<Square className="h-4 w-4 mr-2 fill-current" />
					Stop
				</>
			) : (
				<>
					<Volume2 className="h-4 w-4 mr-2" />
					Listen
				</>
			)}
		</Button>
	);
}
