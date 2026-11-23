"use client"; // Controlled inputs and submit handling need the browser.

// A reusable form for both "create a post" and "edit a post". The parent
// page decides what happens on submit (create vs update).

import { useState, FormEvent } from "react";
import { Post } from "@/lib/types";

interface PostFormProps {
  initialPost?: Post; // when editing, pre-fill from this post
  submitLabel: string;
  onSubmit: (title: string, content: string) => Promise<void>;
}

export default function PostForm({ initialPost, submitLabel, onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Send the typed title/content to whatever the parent page wants to do.
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(title, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Content
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
