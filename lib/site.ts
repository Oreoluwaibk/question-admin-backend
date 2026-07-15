export const MARKETING_SITE_URL =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL ??
  "https://oiquestionbank.netlify.app";

export const MARKETING_LINKS = {
  home: MARKETING_SITE_URL,
  privacy: `${MARKETING_SITE_URL}/privacy`,
  terms: `${MARKETING_SITE_URL}/terms`,
  deleteAccount: `${MARKETING_SITE_URL}/delete-account`,
  support: `${MARKETING_SITE_URL}/support`,
  contact: `${MARKETING_SITE_URL}/contact`,
} as const;
