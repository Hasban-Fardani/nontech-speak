"use client";

import { FileAudio, UploadCloud, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";

interface AudioUploaderProps {
	onFileSelect?: (file: File) => void;
}

export function AudioUploader({ onFileSelect }: AudioUploaderProps) {
	const [dragActive, setDragActive] = React.useState(false);
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files?.[0]) {
			handleFiles(e.dataTransfer.files[0]);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.files?.[0]) {
			handleFiles(e.target.files[0]);
		}
	};

	const handleFiles = (file: File) => {
		// Basic validation for UI demo
		if (file.type.startsWith("audio/")) {
			setSelectedFile(file);
			if (onFileSelect) onFileSelect(file);
		} else {
			// In real implementation we'd show an error toast here
			console.error("Please upload an audio file");
		}
	};

	const clearFile = () => {
		setSelectedFile(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const triggerInput = () => {
		inputRef.current?.click();
	};

	return (
		<fieldset
			className={`relative w-full border-2 border-dashed rounded-xl p-8 transition-colors text-center ${
				dragActive
					? "border-primary bg-primary/5"
					: "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
			}`}
			onDragEnter={handleDrag}
			onDragLeave={handleDrag}
			onDragOver={handleDrag}
			onDrop={handleDrop}
			aria-label="File Upload Dropzone"
		>
			<input
				id="audio-upload"
				ref={inputRef}
				type="file"
				className="hidden"
				accept="audio/*"
				onChange={handleChange}
			/>

			{selectedFile ? (
				<div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
					<div className="flex items-center space-x-4">
						<div className="p-2 bg-primary/10 rounded-full">
							<FileAudio className="h-6 w-6 text-primary" />
						</div>
						<div className="text-left">
							<p className="font-medium text-sm truncate max-w-[200px]">
								{selectedFile.name}
							</p>
							<p className="text-xs text-muted-foreground">
								{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={(e) => {
							e.stopPropagation();
							clearFile();
						}}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					<div className="flex justify-center">
						<div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
							<UploadCloud className="h-10 w-10 text-muted-foreground" />
						</div>
					</div>
					<div>
						<label
							htmlFor="audio-upload"
							className="text-base font-medium cursor-pointer hover:underline"
						>
							Click to upload
						</label>
						<span className="text-base font-medium"> or drag & drop</span>
						<p className="text-sm text-muted-foreground mt-1">
							Supports MP3, WAV, M4A (max 10MB)
						</p>
					</div>
					<Button variant="outline" onClick={triggerInput} type="button">
						Select File
					</Button>
				</div>
			)}
		</fieldset>
	);
}
