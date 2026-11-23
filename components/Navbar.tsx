"use client"; // Reads auth state and reacts to clicks, so it must run in the browser.

// The top bar shown on every page: links change depending on login state.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // Log out, then send the user back to the home page.
  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          Blog
        </Link>
        <div className="navbar-links">
          {loading ? null : user ? (
            // Logged in: show a link to write a post, the user's name, and logout.
            <>
              <Link href="/posts/new">New post</Link>
              <span className="navbar-user">{user.name}</span>
              <button onClick={handleLogout} className="link-button">
                Logout
              </button>
            </>
          ) : (
            // Logged out: show links to register and log in.
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
