import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_PATH, REFRESH_COOKIE_NAME } from "@/lib/auth/constants";

// UX redirect only. It checks that the cookie exists, not that it's valid.
// The API remains the actual authorization gate.
export default function proxy(request: NextRequest) {
  if (request.cookies.has(REFRESH_COOKIE_NAME)) return NextResponse.next();

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/app/:path*"] };
