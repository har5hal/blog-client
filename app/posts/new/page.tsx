"use client"; // Uses auth state, router and a form, all browser-only.

// Page for writing a brand new post. Must be logged in.

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import PostForm from "@/components/PostForm";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";

export default function NewPostPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Send the new post to the backend, then go look at it.
  async function handleCreate(title: string, content: string) {
    const data = await api<{ post: Post }>("/posts", {
      method: "POST",
      body: { title, content },
      token,
    });
    router.push(`/posts/${data.post._id}`);
  }

  return (
    <RequireAuth>
      <h1>New post</h1>
      <PostForm submitLabel="Publish" onSubmit={handleCreate} />
    </RequireAuth>
  );
}
