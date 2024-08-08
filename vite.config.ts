import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";

interface ENVType {
  VITE_APP_TITLE: string;
  VITE_APP_LOGO: string;
  VITE_APP_KEYWORDS: string;
  VITE_APP_DESCRIPTION: string;
  VITE_APP_USE_MOCK: string;
  VITE_APP_API_BASE_URL: string;
  VITE_APP_ROUTER_BASE_URL: string;
  [key: string]: string;
}

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd()) as ENVType;

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        // you don't have to add <script src='' /> in index.html
        entry: "src/main.tsx",

        inject: {
          data: {
            title: env.VITE_APP_TITLE,
            logo: env.VITE_APP_LOGO,
          },
          // keywords and desciption
          tags: [
            {
              injectTo: "head",
              tag: "meta",
              attrs: { name: "keywords", content: env.VITE_APP_KEYWORDS },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: { name: "description", content: env.VITE_APP_DESCRIPTION },
            },
            // other attrs add to window.VITE_APP_SETTING
            {
              injectTo: "body",
              tag: "script",
              attrs: { type: "text/javascript" },
              children: `window.VITE_APP_SETTING = ${JSON.stringify(env)}`,
            }
          ],
        },
      }),
    ],
    // path alias
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "./src"),
        },
      ],
    },
  };
});
