import type { ResolvedOptions } from "@shared/configuration/options";

export const validateSlug = (slug: string, name: string): string => {
  if (
    typeof slug !== "string" ||
    !slug ||
    slug === "." ||
    slug === ".." ||
    /[\s/\\?#%]/u.test(slug) ||
    Array.from(slug).some(
      (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  ) {
    throw new TypeError(`${name} must be a nonempty URL path segment.`);
  }

  // Also reject malformed Unicode before passing a slug to a URL encoder.
  encodeURIComponent(slug);

  return slug;
};

export const publicBaseUrl = (config: ResolvedOptions): string =>
  `${config.baseUrl}/public/o/${encodeURIComponent(config.organizationSlug)}`;
