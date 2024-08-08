/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string,
  readonly VITE_APP_LOGO: string,
  readonly VITE_APP_KEYWORDS: string,
  readonly VITE_APP_DESCRIPTION: string,
  readonly VITE_APP_USE_MOCK: string,
  readonly VITE_APP_API_BASE_URL: string,
  readonly VITE_APP_ROUTER_BASE_URL: string,
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}