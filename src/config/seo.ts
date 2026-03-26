import { APP_NAME, APP_DESCRIPTION } from "@/constants";

export const SEO_CONFIG = {
  defaultTitle: APP_NAME,
  titleTemplate: `%s | ${APP_NAME}`,
  defaultDescription: APP_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
  },
  twitter: {
    handle: "@atomicorder",
    site: "@atomicorder",
    cardType: "summary_large_image",
  },
} as const;
