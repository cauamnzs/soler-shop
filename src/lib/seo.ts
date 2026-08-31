export const SITE_URL = "https://solershop.com.br";

export const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/62327c41-e3f5-47bb-a4a4-1d4867caadb4/id-preview-d3308364--7e21f7cd-8261-4cb3-8919-770d397617f0.lovable.app-1775438059113.png";

export const DEFAULT_DESCRIPTION =
  "Descubra perfumes importados, skincare e acessórios selecionados a dedo de Santos & Ilhabela, Brasil. 100% autênticos.";

const setMeta = (key: string, content: string, attr: "name" | "property" = "name") => {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

export const setCanonical = (href: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

export interface PageMetaOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "product";
}

export const applyPageMeta = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: PageMetaOptions) => {
  document.title = title;
  setMeta("description", description);
  setMeta("og:title", title, "property");
  setMeta("og:description", description, "property");
  setMeta("og:image", image, "property");
  setMeta("og:url", `${SITE_URL}${path}`, "property");
  setMeta("og:type", type, "property");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);
  setMeta("twitter:image", image);
  setMeta("twitter:card", "summary_large_image");
  setCanonical(`${SITE_URL}${path}`);
};

export const injectJsonLd = (id: string, data: Record<string, unknown>) => {
  removeJsonLd(id);
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export const removeJsonLd = (id: string) => {
  document.getElementById(id)?.remove();
};
