import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { audioFiles } from "../db/schema";
import { uploadAudioToR2 } from "../services/storage.service";

export const audioRoutes = new Elysia({ prefix: "/api/audio" })
	/**
	 * POST /api/audio/upload
	 * Upload audio file to R2 storage
	 */
	.post(
		"/upload",
		async ({ body, request, set }) => {
			// Validate session
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			const { file } = body;

			try {
				// Upload to R2
				const uploadResult = await uploadAudioToR2(file, session.user.id);

				// Save to database
				const [audioFile] = await db
					.insert(audioFiles)
					.values({
						userId: session.user.id,
						fileUrl: uploadResult.fileUrl,
						fileSize: uploadResult.fileSize,
						mimeType: uploadResult.mimeType,
						originalFilename: uploadResult.originalFilename,
						transcriptionStatus: "pending",
					})
					.returning();

				return {
					success: true,
					data: audioFile,
				};
			} catch (error) {
				console.error("Audio upload error:", error);

				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";

				set.status = 500;
				return { error: errorMessage };
			}
		},
		{
			body: t.Object({
				file: t.File({
					type: ["audio/mpeg", "audio/wav", "audio/webm", "audio/mp4"],
					maxSize: 10 * 1024 * 1024, // 10MB
				}),
			}),
		},
	)

	/**
	 * POST /api/audio/transcribe
	 * Transcribe audio file using Gemini AI
	 * NOTE: Currently disabled due to TanStack AI type issues
	 */
	.post(
		"/transcribe",
		async ({ body, request, set }) => {
			// Validate session
			const session = await auth.api.getSession({ headers: request.headers });
			if (!session) {
				set.status = 401;
				return { error: "Unauthorized" };
			}

			const { audioFileId } = body;

			try {
				// Fetch audio file from database
				const [audioFile] = await db
					.select()
					.from(audioFiles)
					.where(eq(audioFiles.id, audioFileId))
					.limit(1);

				if (!audioFile) {
					set.status = 404;
					return { error: "Audio file not found" };
				}

				// Verify ownership
				if (audioFile.userId !== session.user.id) {
					set.status = 403;
					return { error: "Forbidden: You don't own this audio file" };
				}

				// TODO: Implement audio transcription when TanStack AI types are fixed
				// For now, return error
				set.status = 501;
				return {
					error:
						"Audio transcription not yet implemented. Type issues with TanStack AI multimodal content need to be resolved.",
				};

				/* 
        // Download audio from R2 and convert to base64
        const response = await fetch(audioFile.fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        // Update status to processing
        await db
          .update(audioFiles)
          .set({ transcriptionStatus: "processing" })
          .where(eq(audioFiles.id, audioFileId));

        // Transcribe using Gemini
        const transcriptionText = await transcribeAudio(
          base64,
          audioFile.mimeType,
        );

        // Update database with transcription
        await db
          .update(audioFiles)
          .set({
            transcriptionText,
            transcriptionStatus: "completed",
          })
          .where(eq(audioFiles.id, audioFileId));

        return {
          success: true,
          text: transcriptionText,
        };
        */
			} catch (error) {
				console.error("Audio transcription error:", error);

				// Update status to failed
				await db
					.update(audioFiles)
					.set({ transcriptionStatus: "failed" })
					.where(eq(audioFiles.id, body.audioFileId));

				const errorMessage =
					error instanceof Error ? error.message : "Unknown error";

				set.status = 500;
				return { error: errorMessage };
			}
		},
		{
			body: t.Object({
				audioFileId: t.String({ minLength: 1 }),
			}),
		},
	);
