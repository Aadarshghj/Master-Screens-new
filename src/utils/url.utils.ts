/**
 * Utility functions for URL handling
 */

/**
 * Decodes HTML entities in URLs, specifically &amp; to &
 * @param url - The URL string that may contain HTML entities
 * @returns The decoded URL string
 */
export const decodeUrlEntities = (url: string): string => {
  if (!url) return "";

  return url
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

/**
 * Ensures a URL is properly formatted for use in browser
 * @param url - The URL to format
 * @returns The properly formatted URL
 */
export const formatUrl = (url: string): string => {
  return decodeUrlEntities(url);
};
