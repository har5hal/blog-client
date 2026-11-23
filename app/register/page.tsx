"use client"; // Has form inputs and click handlers, so it needs the browser.

// The sign-up page: Asha types her name, email and password, and we create
// her account.

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  // Each input is "controlled": React state is the single source of truth
  // for what's in the box, and typing updates that state.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Runs when the form is submitted: ask the backend to create the account.
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.push("/"); // success: go to the home page
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
