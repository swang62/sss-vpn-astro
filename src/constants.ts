export const SECRET_CONFIG =
  import.meta.env.SECRET_CONFIG || process.env.SECRET_CONFIG;

export const BASE_DOMAIN =
  import.meta.env.BASE_DOMAIN || process.env.BASE_DOMAIN;

export const isProduction =
  import.meta.env.PROD || process.env.NODE_ENV === "production";
