import { useEffect } from 'react';
import { DEFAULT_IMAGE, DEFAULT_LOCALE, SITE_NAME, THEME_COLOR, pageMetadata, routeUrl } from '../seo/site';

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      element.removeAttribute(key);
      return;
    }
    element.setAttribute(key, value);
  });
};

const upsertLink = (rel, href, attributes = {}) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
};

const removeJsonLd = () => {
  document.head
    .querySelectorAll('script[type="application/ld+json"][data-seo-jsonld="true"]')
    .forEach((script) => script.remove());
};

const addJsonLd = (schemas) => {
  removeJsonLd();
  schemas.filter(Boolean).forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoJsonld = 'true';
    script.dataset.index = String(index);
    script.textContent = JSON.stringify(schema, (_, value) => value === undefined ? undefined : value);
    document.head.appendChild(script);
  });
};

const SEO = ({
  page,
  title,
  description,
  keywords,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex,
  schemas = [],
}) => {
  useEffect(() => {
    const base = page ? pageMetadata[page] : {};
    const resolvedPath = path || base?.path || window.location.pathname;
    const canonical = routeUrl(resolvedPath);
    const resolvedTitle = title || base?.title || pageMetadata.home.title;
    const resolvedDescription = description || base?.description || pageMetadata.home.description;
    const resolvedKeywords = keywords || base?.keywords || pageMetadata.home.keywords;
    const robots = noindex || base?.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    document.title = resolvedTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: resolvedDescription });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: resolvedKeywords });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: THEME_COLOR });
    upsertMeta('meta[name="application-name"]', { name: 'application-name', content: SITE_NAME });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: resolvedTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: resolvedDescription });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: DEFAULT_LOCALE });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: resolvedTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: resolvedDescription });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    upsertLink('canonical', canonical);
    addJsonLd(schemas);

    return removeJsonLd;
  }, [description, image, keywords, noindex, page, path, schemas, title, type]);

  return null;
};

export default SEO;
