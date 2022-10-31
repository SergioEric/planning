import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function AuthMiddleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
