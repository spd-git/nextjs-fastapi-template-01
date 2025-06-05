import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { usersCurrentUser } from "@/app/clientService"; // Assuming clientService is correctly pathed

export async function middleware(request: NextRequest) {
  // Check if Mock Mode is enabled via environment variable
  const mockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

  if (mockModeEnabled) {
    console.log("[Middleware] Mock mode enabled. Setting mock access token.");
    
    // Create a response object
    const response = NextResponse.next();
    
    // Set a mock access token cookie if it doesn't exist
    if (!request.cookies.has("accessToken")) {
      const mockToken = "mock_access_token_1234567890";
      response.cookies.set({
        name: "accessToken",
        value: mockToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      console.log("[Middleware] Set mock access token cookie");
    }
    
    return response;
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
  const { error } = await usersCurrentUser(options);

  if (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();


/*
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
*/
}

export const config = {
  // Matcher applies this middleware to /dashboard and its sub-paths.
  matcher: ["/dashboard/:path*"],
};
