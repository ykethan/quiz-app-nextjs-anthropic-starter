import { auth } from "@/auth/lucia";
import * as context from "next/headers";

import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        Location: "/login", // redirect to login page
      },
    });
  }

  return new Response(null, {
    status: 200,
  });
};
