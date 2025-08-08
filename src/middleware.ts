import { NextRequest, NextResponse } from "next/server";
import Jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;  

  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/verifyemail";

  const token = request.cookies.get("token")?.value || "";

  // console.log("Token: ", token);

  if (isPublicPath && token) {
    // const decodedToken: any = Jwt.verify(token, process.env.TOKEN_SECRET!);
    // console.log("Decoded Token: ", decodedToken.role);
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // if (path.startsWith("/admin")) {
  //   try {
  //     const decodedToken: any = Jwt.verify(token, process.env.TOKEN_SECRET!);
  //     console.log("Decoded Token: ",decodedToken.role);

  //     if (decodedToken.role !== "admin") {
  //       return NextResponse.redirect(new URL("/", request.nextUrl));
  //     }
  //   } catch (error) {
  //     return NextResponse.redirect(new URL("/login", request.nextUrl));
  //   }
  // }
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/admin/:path*",
  ],
};


