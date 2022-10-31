import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prismadb";
import * as Yup from 'yup';
import { Prisma } from '@prisma/client';
import { dateIsValid } from '@/lib/utils';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (!req.body) {
    return res.status(405).json({ error: "missing body" })
  }
  const { date, items, teamId }: { date: any, items: Prisma.JsonObject, teamId: string } = JSON.parse(req.body);

  if (req.method != "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  const validDate = dateIsValid(new Date(date));
  // only objects with numbers as keys
  const validItems = Object.entries(items).length > 0 && Object.keys(items).every(key => !isNaN(+key));

  const validTeamId = teamId != '' && !isNaN(+teamId);
  if (!validDate || !validItems || !validTeamId) {
    const errors = {
      ...(!validDate && {
        date: "Date is invalid",
      }),
      ...(!validItems && {
        items: "The item list does not follow the correct format"
      }),
      ...(!validTeamId && {
        teamId: "invalid team id",
      })
    }

    return res.status(400).json({
      message: "Bad fields",
      fields: errors,
    })

  }

  const daily = await prisma.daily.findFirst({
    where: {
      teamId: +teamId,
      date: {
        in: new Date(date),
      }
    }
  });
  if (daily) {

    const response = await prisma.daily.update({
      where: {
        id: daily.id,
      },
      data: {
        ...daily,
        // date:new Date(date),
        itemList: items,
      }
    });
    console.log("daily updated", response)
    return res.status(200).send(response)
  }
  else {
    const newDaily = await prisma.daily.create({
      data: {
        teamId: +teamId,
        itemList: items,
        date: new Date(date)
      }
    });
    console.log("newDaily else created", newDaily)
    return res.status(200).send(newDaily)
  }

}