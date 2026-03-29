import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Protect unauthorized user to access create post route
  if (pathname.startsWith("/create") && !token) {
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`, request.url)
    );
    //redirect back to create after login succesfull  
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create"],
};
