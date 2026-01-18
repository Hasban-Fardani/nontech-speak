import crypto from "node:crypto";

// Encryption configuration
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Get encryption secret from environment
 * Falls back to a default for development (NOT SECURE FOR PRODUCTION)
 */
function getEncryptionSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET must be set in environment variables",
    );
  }

  return secret;
}

/**
 * Derive encryption key from secret using PBKDF2
 */
function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha512");
}

/**
 * Encrypt sensitive data (e.g., API keys)
 * Returns base64-encoded encrypted string
 */
export function encrypt(plainText: string): string {
  if (!plainText) {
    throw new Error("Cannot encrypt empty string");
  }

  const secret = getEncryptionSecret();

  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Derive key from secret
  const key = deriveKey(secret, salt);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  // Get auth tag
  const tag = cipher.getAuthTag();

  // Combine salt + iv + tag + encrypted data
  const combined = Buffer.concat([salt, iv, tag, encrypted]);

  // Return as base64
  return combined.toString("base64");
}

/**
 * Decrypt encrypted data
 * Returns original plaintext
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error("Cannot decrypt empty string");
  }

  const secret = getEncryptionSecret();

  // Decode from base64
  const combined = Buffer.from(encryptedData, "base64");

  // Extract components
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = combined.subarray(TAG_POSITION, ENCRYPTED_POSITION);
  const encrypted = combined.subarray(ENCRYPTED_POSITION);

  // Derive key from secret
  const key = deriveKey(secret, salt);

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  // Decrypt
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Check if a string is encrypted (basic check)
 */
export function isEncrypted(data: string): boolean {
  try {
    // Try to decode as base64
    const decoded = Buffer.from(data, "base64");
    // Check if length matches expected format
    return decoded.length >= ENCRYPTED_POSITION;
  } catch {
    return false;
  }
}
