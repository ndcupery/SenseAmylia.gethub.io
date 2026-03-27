import { useEffect } from "react";

interface HeadOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function useHead(options: HeadOptions) {
  useEffect(() => {
    const originals: Record<string, string> = {};

    if (options.title) {
      originals.title = document.title;
      document.title = options.title;
    }

    const metaUpdates: [string, string, string][] = [];

    if (options.description) {
      metaUpdates.push(
        ['meta[name="description"]', "content", options.description],
        ['meta[property="og:description"]', "content", options.description],
        ['meta[name="twitter:description"]', "content", options.description],
      );
    }
    if (options.title) {
      metaUpdates.push(
        ['meta[property="og:title"]', "content", options.title],
        ['meta[name="twitter:title"]', "content", options.title],
      );
    }
    if (options.ogImage) {
      metaUpdates.push(
        ['meta[property="og:image"]', "content", options.ogImage],
        ['meta[name="twitter:image"]', "content", options.ogImage],
      );
    }
    if (options.ogUrl) {
      metaUpdates.push(
        ['meta[property="og:url"]', "content", options.ogUrl],
      );
    }

    for (const [selector, attr, value] of metaUpdates) {
      const el = document.querySelector(selector);
      if (el) {
        originals[selector] = el.getAttribute(attr) ?? "";
        el.setAttribute(attr, value);
      }
    }

    return () => {
      if (originals.title) document.title = originals.title;
      for (const [selector, attr] of metaUpdates) {
        const el = document.querySelector(selector);
        if (el && originals[selector] !== undefined) {
          el.setAttribute(attr, originals[selector]);
        }
      }
    };
  }, [options.title, options.description, options.ogImage, options.ogUrl]);
}
