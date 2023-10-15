import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { pathToRegexp } from "path-to-regexp";

const re = pathToRegexp("/:slug/:path*");

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    if (req.nextUrl.pathname === "/") {
      return;
    }

    const arr = re.exec(req.nextUrl.pathname);
    if (arr === null || req.nextauth.token === null) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const slug = arr[1];

    const res = await fetch(`${req.nextUrl.origin}/api/profile/schoolRoles`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        slug,
        email: req.nextauth.token.email,
      }),
    });
    const data = await res.json();
    if (data.roles.length === 0) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
);

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: "/((?!api/public|_next/static|_next/image|favicon.ico).*)",
};
