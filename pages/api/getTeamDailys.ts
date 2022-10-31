import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate, teamId } = req.query as { startDate: string, endDate: string, teamId: string };

  const response = await prisma.daily.findMany({
    where: {
      teamId: +teamId,
      date: {
        lte: new Date(endDate),
        gte: new Date(startDate),
      }
    }
  });


  return res.status(200).send(response);

}