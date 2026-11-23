"use client"; // Needs auth state and the router, both browser-only.

// Wrap a page's content with this to send logged-out visitors to /login.
// While we are still checking who is logged in, it shows nothing noisy.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Once we know for sure there is no user, bounce to the login page.
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p className="status">Checking login...</p>;
  if (!user) return null; // redirect is in flight, render nothing
  return <>{children}</>;
}
