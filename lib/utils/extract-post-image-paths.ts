const BUCKET_PREFIX = "/storage/v1/object/public/post-images/";

function addFromUrl(url: string, paths: Set<string>) {
  const idx = url.indexOf(BUCKET_PREFIX);
  if (idx !== -1) {
    paths.add(decodeURIComponent(url.slice(idx + BUCKET_PREFIX.length)));
  }
}

// Finds every post-images Storage path referenced by a post (cover image +
// any inline markdown images in the body), so they can be removed from
// Storage before the row is deleted (backend-specification.md §5).
export function extractPostImagePaths(post: {
  cover_image_url: string | null;
  body: string;
}): string[] {
  const paths = new Set<string>();

  if (post.cover_image_url) addFromUrl(post.cover_image_url, paths);

  const markdownImageRegex = /!\[[^\]]*\]\(([^)\s]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = markdownImageRegex.exec(post.body)) !== null) {
    addFromUrl(match[1], paths);
  }

  return Array.from(paths);
}
