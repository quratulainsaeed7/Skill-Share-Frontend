/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MESSAGING_API_URL: string
    readonly VITE_SKILL_SERVICE_URL: string
    readonly VITE_BOOKING_SERVICE_URL: string
    readonly VITE_USER_SERVICE_URL: string
    readonly VITE_WALLET_SERVICE_URL: string
    readonly VITE_PAYMENT_SERVICE_URL: string
    readonly VITE_REVIEW_SERVICE_URL: string
    readonly VITE_ADMIN_SERVICE_URL: string
    // Add other env variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
