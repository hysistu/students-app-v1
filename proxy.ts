import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get("session")?.value);
  if (!hasSession && request.nextUrl.pathname !== "/login")
    return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/students/:path*",
    "/courses/:path*",
    "/cart/:path*",
    "/my-courses/:path*",
    "/login",
  ],
};
