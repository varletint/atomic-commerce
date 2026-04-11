import { Helmet } from 'react-helmet-async';
import { env } from '@/config/env';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

/** OG/Twitter require absolute http(s) URLs; relative paths fail for most crawlers. */
function absoluteOgImageUrl(href: string): string {
  const trimmed = href.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const origin = env.appUrl.replace(/\/$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${path}`;
}

export const SEO = ({ title, description, url, image, type = 'website' }: SEOProps) => {
  const siteName = 'Atomic Order';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const ogImage = absoluteOgImageUrl(image ?? env.ogDefaultImage);

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};
