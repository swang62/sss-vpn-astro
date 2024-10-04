/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SECRET_CONFIG: string;
  readonly PUBLIC_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
