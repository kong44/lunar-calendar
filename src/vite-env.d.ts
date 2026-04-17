/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GOOGLE_CALENDAR_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
