// Shared TypeScript shapes for the data the backend sends us. Keeping them
// here means every file agrees on what a "User" or "Post" looks like.

// A logged-in user, as returned by register/login/me.
export interface User {
  id: string;
  name: string;
  email: string;
}

// The author info attached to a post once the backend "populates" it.
export interface PostAuthor {
  _id: string;
  name: string;
}

// A blog post. `author` is sometimes just a string id (right after create or
// update) and sometimes a full object (when listing or reading one post).
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string | PostAuthor;
  createdAt: string;
  updatedAt: string;
}
