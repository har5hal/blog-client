"use client"; // Fetches one post and reacts to clicks (delete), so it runs in the browser.

// The post detail page: shows the full post, and Edit/Delete if you wrote it.

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";
import { authorId, authorName, formatDate } from "@/lib/post-helpers";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch the post whenever the id in the URL changes.
  useEffect(() => {
    api<{ post: Post }>(`/posts/${id}`)
      .then((data) => setPost(data.post))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load post"));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!post) return <p className="status">Loading...</p>;

  // Only show Edit/Delete if the logged-in user is the one who wrote this post.
  const isAuthor = user !== null && user.id === authorId(post);

  // Actually delete the post, then go back home.
  async function handleDelete() {
    setDeleteError("");
    try {
      await api(`/posts/${id}`, { method: "DELETE", token });
      router.push("/");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete post");
    }
  }

  return (
    <div>
      <h1 className="post-title">{post.title}</h1>
      <p className="post-meta">
        By {authorName(post)} on {formatDate(post.createdAt)}
      </p>
      <p className="post-content">{post.content}</p>

      {isAuthor && (
        <div style={{ marginTop: 24 }}>
          {deleteError && <p className="error">{deleteError}</p>}
          {!confirmingDelete ? (
            <div className="button-row">
              <Link href={`/posts/${id}/edit`} className="button">
                Edit
              </Link>
              <button className="button button-danger" onClick={() => setConfirmingDelete(true)}>
                Delete
              </button>
            </div>
          ) : (
            // An inline confirm step instead of the browser's window.confirm.
            <div className="button-row">
              <span>Delete this post for good?</span>
              <button className="button button-danger" onClick={handleDelete}>
                Yes, delete
              </button>
              <button className="button button-secondary" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
