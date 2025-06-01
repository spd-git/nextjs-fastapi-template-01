import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { usersCurrentUser } from "@/app/clientService"; // Assuming clientService is correctly pathed

export async function middleware(request: NextRequest) {
  // Check if Mock Mode is enabled via environment variable
  const mockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

  if (mockModeEnabled) {
    console.log("[Middleware] Mock mode enabled. Bypassing authentication and allowing request.");
    // In mock mode, we assume the user is authenticated and allow the request to proceed.
    // MSW will handle the API requests to return mock data.
    return NextResponse.next();
  }

  // Original authentication logic for non-mock mode
  console.log("[Middleware] Mock mode disabled. Proceeding with standard authentication.");
  const token = request.cookies.get("accessToken");

  if (!token) {
    console.log("[Middleware] No accessToken cookie found. Redirecting to login.");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  };

  try {
    console.log("[Middleware] Validating token with usersCurrentUser API...");
    // Note: usersCurrentUser is an async function that returns { data, error, response }
    // We need to handle the promise and the structure of its result.
    const result = await usersCurrentUser(options);

    if (result.error) {
      console.error("[Middleware] Token validation failed:", result.error);
      // Clear the invalid cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      console.log("[Middleware] Deleted invalid accessToken cookie.");
      return response;
    }

    if (!result.data) {
      console.warn("[Middleware] Token validation returned no user data, though no error. Treating as invalid.");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }

    // console.log("[Middleware] Token validated successfully for user:", result.data);
    return NextResponse.next();

  } catch (e) {
    console.error("[Middleware] Exception during token validation:", e);
    // In case of an unexpected exception during the API call
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    return response;
  }
}

export const config = {
  // Matcher applies this middleware to /dashboard and its sub-paths.
  matcher: ["/dashboard/:path*"],
};
