import { type DefaultSession } from "next-auth";

// This "augments" the original NextAuth module.
// We are telling it to add "id" and "role" to its default User type.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // This is the new property we are adding
    } & DefaultSession["user"];
  }
}