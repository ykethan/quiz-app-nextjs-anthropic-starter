import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { github } from "@lucia-auth/oauth/providers";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
// import "lucia/polyfill/node";

import { cache } from "react";
import * as context from "next/headers";

import sqlite from "better-sqlite3";
import fs from "fs";

const db = sqlite("mysqlite.db");
db.exec(fs.readFileSync("schema.sql", "utf8"));

export const auth = lucia({
  adapter: betterSqlite3(db, {
    user: "user",
    session: "user_session",
    key: "user_key",
  }),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  getUserAttributes: (data) => {
    return {
      githubUsername: data.username,
      avatarUrl: data.avatar_url,
    };
  },
});

export const githubAuth = github(auth, {
  clientId: process.env.GITHUB_CLIENT_ID ?? "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
});

export type Auth = typeof auth;

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});
