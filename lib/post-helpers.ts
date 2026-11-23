// Small shared helpers for working with Post data, used by several pages.
import { Post } from "@/lib/types";

// The author field is sometimes a plain id string, sometimes a populated
// object with a name. This picks a name to display either way.
export function authorName(post: Post): string {
  if (typeof post.author === "string") return "Unknown";
  return post.author.name;
}

// The author's id, used to check "is the logged-in user the author?".
export function authorId(post: Post): string {
  return typeof post.author === "string" ? post.author : post.author._id;
}

// Turns a long post body into a short preview for the list page.
export function excerpt(content: string, max = 140): string {
  if (content.length <= max) return content;
  return content.slice(0, max).trimEnd() + "...";
}

// Formats an ISO date string into something readable, e.g. "Nov 19, 2026".
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
