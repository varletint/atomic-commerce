import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

export const SEO = ({ title, description, url, image, type = 'website' }: SEOProps) => {
  const siteName = 'Atomic Order';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const defaultImage = '/favicon.svg';

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
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};
