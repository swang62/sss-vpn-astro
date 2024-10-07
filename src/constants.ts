export const SECRET_CONFIG =
  import.meta.env.SECRET_CONFIG || process.env.SECRET_CONFIG;

export const HOST_DOMAIN =
  import.meta.env.HOST_DOMAIN || process.env.HOST_DOMAIN;

export const isProduction =
  import.meta.env.PROD ||
  import.meta.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "production";
