"use client"; // Fetches data after the page loads, so it needs useState/useEffect.

// The home page: shows every post as a list of cards, newest first.

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";
import { authorName, excerpt, formatDate } from "@/lib/post-helpers";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[] | null>(null); // null = still loading
  const [error, setError] = useState("");

  // Like a to-do note: "once the page shows up, go fetch the posts."
  // The empty [] means this only runs once, right after the first render.
  useEffect(() => {
    api<{ posts: Post[] }>("/posts")
      .then((data) => setPosts(data.posts))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load posts"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (posts === null) return <p className="status">Loading posts...</p>;
  if (posts.length === 0) return <p className="status">No posts yet. Be the first to write one!</p>;

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <Link key={post._id} href={`/posts/${post._id}`} className="post-card">
          <h2>{post.title}</h2>
          <p className="post-meta">
            By {authorName(post)} on {formatDate(post.createdAt)}
          </p>
          <p className="post-excerpt">{excerpt(post.content)}</p>
        </Link>
      ))}
    </div>
  );
}
