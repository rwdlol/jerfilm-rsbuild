import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";

export default defineConfig(() => {
	return {
		plugins: [
			react(),
			tailwindcss(),
			compression({ algorithms: ["brotliCompress", "gzip"] }),
		],
		build: {
			chunkSizeWarningLimit: 700,
			rolldownOptions: {
				output: {
					codeSplitting: {
						groups: [
							{
								name: "vendor",
								test: /node_modules/,
								priority: 10,
							},
						],
					},
				},
			},
		},
	};
});
