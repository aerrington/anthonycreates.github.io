const LIVE_ENTRY_PATH = "/content/live/";
const INCLUDE_DRAFTS = process.env.LIVE_INCLUDE_DRAFTS === "1";

function asDate(value, inputPath) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.valueOf())) {
    throw new Error(`${inputPath}: entries need a valid date.`);
  }

  return date;
}

function plainText(value = "") {
  return String(value)
    .replace(/^---[\s\S]*?---/, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#~-]/g, " ")
    .replace(/&(?:nbsp|amp|quot|#39);/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function publishedEntries(collectionApi) {
  return Array.from(collectionApi.getFilteredByTag("live-entry"))
    .filter((entry) => INCLUDE_DRAFTS || entry.data.draft === false)
    .sort((a, b) => b.date - a.date);
}

export default function (eleventyConfig) {
  eleventyConfig.ignores.add("live-design/**");
  eleventyConfig.ignores.add("README.md");

  [
    "index.html",
    "404.html",
    "CNAME",
    ".nojekyll",
    "favicon.svg",
    "css",
    "fonts",
    "home",
    "projects",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  eleventyConfig.addPassthroughCopy({
    "src/live/assets": "live/assets",
  });
  eleventyConfig.addPassthroughCopy(
    "content/live/**/*.{avif,gif,jpeg,jpg,mp4,png,webp}",
    {
      mode: "html-relative",
      failOnError: true,
    },
  );

  eleventyConfig.addFilter("displayDate", (value) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(asDate(value, "Date filter")),
  );

  eleventyConfig.addFilter("isoDate", (value) =>
    asDate(value, "Date filter").toISOString().slice(0, 10),
  );

  eleventyConfig.addFilter("plainText", plainText);
  eleventyConfig.addFilter("metaDescription", (value) => {
    const text = plainText(value);
    return text.length > 157 ? `${text.slice(0, 156).trimEnd()}…` : text;
  });
  eleventyConfig.addFilter("take", (items, count) =>
    Array.from(items ?? []).slice(0, count),
  );
  eleventyConfig.addFilter("drop", (items, count) =>
    Array.from(items ?? []).slice(count),
  );
  eleventyConfig.addFilter("rfc822", (value) =>
    asDate(value, "Feed date").toUTCString(),
  );
  eleventyConfig.addFilter("xmlEscape", (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;"),
  );
  eleventyConfig.addFilter("absoluteUrl", (value, baseUrl) =>
    new URL(value, baseUrl).toString(),
  );

  eleventyConfig.addCollection("liveEntries", publishedEntries);
  eleventyConfig.addCollection("livePracticeEntries", (collectionApi) =>
    publishedEntries(collectionApi).filter(
      (entry) => (entry.data.projects ?? []).length === 0,
    ),
  );
  eleventyConfig.addCollection("liveProjects", (collectionApi) => {
    const projects = new Map();

    for (const entry of publishedEntries(collectionApi)) {
      for (const project of entry.data.projectDetails ?? []) {
        const existing = projects.get(project.slug);
        projects.set(project.slug, {
          ...project,
          count: (existing?.count ?? 0) + 1,
        });
      }
    }

    return Array.from(projects.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  });

  eleventyConfig.addTransform("live-entry-word-limit", function (content) {
    if (!this.page?.inputPath?.includes(LIVE_ENTRY_PATH)) {
      return content;
    }

    const match = content.match(
      /<div class="entry-body">([\s\S]*?)<\/div>\s*<div class="drawn-divider-placeholder"/,
    );
    const wordCount = plainText(match?.[1] ?? "").split(/\s+/).filter(Boolean).length;

    if (wordCount > 500) {
      throw new Error(
        `${this.page.inputPath}: Live entries have a hard ceiling of 500 words (found ${wordCount}).`,
      );
    }

    if (wordCount > 300) {
      console.warn(
        `[Live] ${this.page.inputPath} is ${wordCount} words; the target is 100–300.`,
      );
    }

    return content;
  });

  return {
    dir: {
      input: ".",
      includes: "src/live/_includes",
      data: "src/live/_data",
      output: "dist",
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
