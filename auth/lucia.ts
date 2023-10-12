import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { github } from "@lucia-auth/oauth/providers";
// import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";

import { cache } from "react";
import * as context from "next/headers";

import postgres from "postgres";

// --- uncomment to use sqlite instead of postgres----
// import sqlite from "better-sqlite3";

// import fs from "fs";

// const db = sqlite("mysqlite.db");
// db.exec(fs.readFileSync("schema.sql", "utf8"));
// ----------------------------
let dbInfo;
if (process.env.DB_SECRET) {
  try {
    dbInfo = JSON.parse(process.env.DB_SECRET);
  } catch (error) {
    console.error("Failed to parse DB_SECRET:", error);
  }
} else {
  dbInfo = {};
}

const sql = postgres({
  host: dbInfo?.host,
  port: dbInfo?.port,
  database: dbInfo?.dbname,
  username: dbInfo?.username,
  password: dbInfo?.password,
});

// sql.file(__dirname + "/schema.sql");
export const auth = lucia({
  adapter: postgresAdapter(sql, {
    user: "users",
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
