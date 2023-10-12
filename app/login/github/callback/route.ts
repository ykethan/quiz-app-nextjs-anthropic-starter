import { auth, githubAuth } from "@/auth/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { cookies, headers } from "next/headers";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, {
    headers,
    cookies,
  });
  const session = await authRequest.validate();
  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
  const cookieStore = cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const { getExistingUser, githubUser, createUser } =
      await githubAuth.validateCallback(code);
    console.log("After GitHub validation");
    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          username: githubUser.login,
          avatar_url: githubUser.avatar_url,
        },
      });
      return user;
    };

    const user = await getUser();
    console.log("got User");
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    console.log("got session");
    authRequest.setSession(session);
    console.log("About to redirect");
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.error("Caught an exception:", e);

    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
