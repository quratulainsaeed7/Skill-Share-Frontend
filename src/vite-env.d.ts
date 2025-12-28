/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MESSAGING_API_URL: string
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
