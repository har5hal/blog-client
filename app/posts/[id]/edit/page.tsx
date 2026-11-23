"use client"; // Fetches the post, then renders a controlled form.

// Page for editing an existing post. Must be logged in; the backend also
// checks you actually own the post.

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import PostForm from "@/components/PostForm";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";

export default function EditPostPage() {
  // The dynamic route [id] gives us the post id from the URL, like a
  // template address with a blank filled in, e.g. /posts/42/edit.
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  // Load the current post so the form can be pre-filled.
  useEffect(() => {
    api<{ post: Post }>(`/posts/${id}`)
      .then((data) => setPost(data.post))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load post"));
  }, [id]);

  // Send the edited title/content, then go back to the post.
  async function handleUpdate(title: string, content: string) {
    await api<{ post: Post }>(`/posts/${id}`, {
      method: "PUT",
      body: { title, content },
      token,
    });
    router.push(`/posts/${id}`);
  }

  return (
    <RequireAuth>
      <h1>Edit post</h1>
      {error && <p className="error">{error}</p>}
      {!error && !post && <p className="status">Loading...</p>}
      {post && <PostForm initialPost={post} submitLabel="Save changes" onSubmit={handleUpdate} />}
    </RequireAuth>
  );
}
