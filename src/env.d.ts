/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORIGIN: string,
  readonly VITE_BASE_URL: string,
  readonly VITE_YEAR: string,
  readonly VITE_START_DATE: string,
  readonly VITE_END_DATE: string,
  readonly VITE_LANDING_ONLY: string,
  readonly VITE_GTM_ID: string,
  readonly VITE_ROOM_STATUS_API: string,
  readonly BUILD_SESSION: boolean
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}
