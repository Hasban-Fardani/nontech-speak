import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";

// Initialize R2 client
const r2Client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
	},
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "nontechspeak-audio";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed audio MIME types
const ALLOWED_MIME_TYPES = [
	"audio/mpeg", // mp3
	"audio/wav", // wav
	"audio/webm", // webm
	"audio/mp4", // m4a
	"audio/x-m4a", // m4a alternative
];

export interface UploadResult {
	fileUrl: string;
	fileSize: number;
	mimeType: string;
	originalFilename: string;
	key: string;
}

/**
 * Validate audio file before upload
 */
export function validateAudioFile(file: File): {
	valid: boolean;
	error?: string;
} {
	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
		};
	}

	// Check MIME type
	if (!ALLOWED_MIME_TYPES.includes(file.type)) {
		return {
			valid: false,
			error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
		};
	}

	return { valid: true };
}

/**
 * Upload audio file to Cloudflare R2
 */
export async function uploadAudioToR2(
	file: File,
	userId: string,
): Promise<UploadResult> {
	// Validate file
	const validation = validateAudioFile(file);
	if (!validation.valid) {
		throw new Error(validation.error);
	}

	// Generate unique filename
	const fileExtension = file.name.split(".").pop() || "mp3";
	const uniqueId = createId();
	const key = `audio/${userId}/${uniqueId}.${fileExtension}`;

	// Convert File to Buffer
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Upload to R2
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: file.type,
		ContentLength: file.size,
	});

	try {
		await r2Client.send(command);

		const fileUrl = generatePublicUrl(key);

		return {
			fileUrl,
			fileSize: file.size,
			mimeType: file.type,
			originalFilename: file.name,
			key,
		};
	} catch (error) {
		console.error("R2 upload error:", error);
		throw new Error("Failed to upload file to storage");
	}
}

/**
 * Delete audio file from Cloudflare R2
 */
export async function deleteAudioFromR2(fileUrl: string): Promise<void> {
	try {
		// Extract key from URL
		const key = extractKeyFromUrl(fileUrl);

		const command = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		await r2Client.send(command);
	} catch (error) {
		console.error("R2 delete error:", error);
		// Don't throw error on delete failure, just log it
		// This prevents cascade failures when deleting translations
	}
}

/**
 * Generate public URL for R2 object
 */
export function generatePublicUrl(key: string): string {
	return `${PUBLIC_URL}/${key}`;
}

/**
 * Extract R2 key from public URL
 */
function extractKeyFromUrl(url: string): string {
	// Remove public URL prefix to get the key
	return url.replace(`${PUBLIC_URL}/`, "");
}
