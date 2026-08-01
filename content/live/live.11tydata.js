const VALID_KINDS = new Set(["made", "learned", "scrapped", "wondering"]);
const INCLUDE_DRAFTS = process.env.LIVE_INCLUDE_DRAFTS === "1";

function entryDate(data) {
  const date = data.date instanceof Date ? data.date : new Date(data.date);

  if (Number.isNaN(date.valueOf())) {
    throw new Error(`${data.page.inputPath}: entries need a valid date.`);
  }

  return date;
}

function isDraft(data) {
  return data.draft !== false;
}

function validateEntry(data) {
  if (!data.title?.trim()) {
    throw new Error(`${data.page.inputPath}: entries need a title.`);
  }

  if (!VALID_KINDS.has(data.kind)) {
    throw new Error(
      `${data.page.inputPath}: kind must be made, learned, scrapped or wondering.`,
    );
  }

  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    throw new Error(`${data.page.inputPath}: draft must be true or false.`);
  }

  if (data.projects !== undefined && !Array.isArray(data.projects)) {
    throw new Error(`${data.page.inputPath}: projects must be a YAML list.`);
  }

  for (const slug of data.projects ?? []) {
    if (!data.projectCatalog[slug]) {
      throw new Error(
        `${data.page.inputPath}: unknown project "${slug}". Add it to projectCatalog.json first.`,
      );
    }
  }

  return entryDate(data);
}

function excerpt(data) {
  const text = String(data.page.rawInput ?? "")
    .replace(/^---[\s\S]*?---/, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= 157) {
    return text;
  }

  return `${text.slice(0, 154).replace(/\s+\S*$/, "").trimEnd()}…`;
}

export default {
  tags: ["live-entry"],
  layout: "layouts/entry.njk",
  eleventyComputed: {
    eleventyExcludeFromCollections(data) {
      return isDraft(data) && !INCLUDE_DRAFTS;
    },
    isLiveEntry: true,
    kindDetails(data) {
      validateEntry(data);
      return data.kindCatalog[data.kind];
    },
    projectDetails(data) {
      validateEntry(data);
      return (data.projects ?? []).map((slug) => ({
        slug,
        ...data.projectCatalog[slug],
      }));
    },
    description(data) {
      validateEntry(data);
      return excerpt(data);
    },
    permalink(data) {
      const date = validateEntry(data);

      if (isDraft(data) && !INCLUDE_DRAFTS) {
        return false;
      }

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const slug =
        data.slug ||
        data.page.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");

      return `/live/${year}/${month}/${slug}/index.html`;
    },
  },
};
