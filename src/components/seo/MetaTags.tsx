import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "@/config";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function MetaTags({ title, description, image, url }: MetaTagsProps) {
  const pageTitle = title
    ? SEO_CONFIG.titleTemplate.replace("%s", title)
    : SEO_CONFIG.defaultTitle;

  const pageDescription = description || SEO_CONFIG.defaultDescription;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription} />

      {/* Open Graph */}
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={pageDescription} />
      {image && <meta property='og:image' content={image} />}
      {url && <meta property='og:url' content={url} />}

      {/* Twitter */}
      <meta name='twitter:card' content={SEO_CONFIG.twitter.cardType} />
      <meta name='twitter:title' content={pageTitle} />
      <meta name='twitter:description' content={pageDescription} />
      {image && <meta name='twitter:image' content={image} />}
    </Helmet>
  );
}
