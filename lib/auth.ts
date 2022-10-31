import { NextApiRequest, NextApiResponse } from "next/types";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session } from "next-auth";

// interface Session {
//   user: {
//     email?: string | null;
//     id?: string | null;
//     name?: string | null;
//   };
// }

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const session = (await unstable_getServerSession(
    req,
    res,
    authOptions,
  )) as Session | null;
  return session;
}