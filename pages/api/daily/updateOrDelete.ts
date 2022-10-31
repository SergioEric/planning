import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prismadb";
import * as Yup from 'yup';
import { Prisma } from '@prisma/client';
import { dateIsValid } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  console.log("**************************", typeof req.body)
  console.log("--------------------------", req)
  if (!req.body) {
    return res.status(405).json({ error: "missing body" })
  }
  const { date, items }: { date: any, items: Prisma.JsonObject } = JSON.parse(req.body ?? "{}");

  const allowed = ["PUT", "DELETE"];

  if (!allowed.includes(req.method ?? '')) {
    res.setHeader("Allow", allowed);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  return res.status(200).send("TODO")
}