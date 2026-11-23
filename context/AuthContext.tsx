"use client"; // This file uses React state and browser storage, so it must run in the browser, not on the server.

// Holds who is logged in (if anyone) and shares it with the whole app, like a
// notice board every page can read. Pages ask this board "who is logged in?"
// instead of each fetching that themselves.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean; // true while we're still checking localStorage/the server
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// We store the token in plain localStorage. This is simple and good enough
// for a small project, but it is readable by any JavaScript on the page
// (e.g. an XSS bug), which is a real risk. The safer alternative is an
// httpOnly cookie set by the server, which JavaScript cannot read at all,
// but that needs the backend's cooperation and more setup than this project needs.
const TOKEN_KEY = "blog_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if we already have a token saved from last time,
  // and if so, ask the backend who that token belongs to. This is how a
  // refresh keeps you logged in instead of forgetting you.
  useEffect(() => {
    // Do the actual work in an async helper so every setState call happens
    // after an await, not directly in the effect body.
    async function restoreSession() {
      const saved = localStorage.getItem(TOKEN_KEY);
      if (!saved) {
        setLoading(false);
        return;
      }
      setToken(saved);
      try {
        const data = await api<{ user: User }>("/auth/me", { token: saved });
        setUser(data.user);
      } catch {
        // Token is invalid/expired: forget it and act as logged out.
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Save the token and user after a successful login or register.
  function saveSession(nextUser: User, nextToken: string) {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  // Log in with email/password and remember the session.
  async function login(email: string, password: string) {
    const data = await api<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    saveSession(data.user, data.token);
  }

  // Create a new account and log in as that user right away.
  async function register(name: string, email: string, password: string) {
    const data = await api<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    saveSession(data.user, data.token);
  }

  // Forget the session so the user is logged out everywhere in the app.
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook so pages can write `const { user } = useAuth()`.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
