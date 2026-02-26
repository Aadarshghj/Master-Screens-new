/**
 * Environment Variables for the vite Application
 *
 *  Note: All custom env vars in Vite must be prefixed with VITE_
 */

declare global {
  interface ImportMetaEnv {
    readonly VITE_FRONT_END_LOGGER_URL: string;
    readonly VITE_BACKEND_BASE_URL: string;
    readonly VITE_S3_BUCKET_NAME: string;
    readonly VITE_S3_REGION: string;
    readonly VITE_S3_UPLOAD_ENABLED: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
