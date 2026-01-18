import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["avatars.githubusercontent.com"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
		],
	},
};

export default nextConfig;
