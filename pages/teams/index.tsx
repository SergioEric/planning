import { NextApiRequest, NextApiResponse } from "next";
import Link from "next/link";
import prisma from "@/lib/prismadb";
// import { getSession } from "@/lib/auth";
import { Team } from "@prisma/client";
import { getSession } from "next-auth/react";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  // @ts-ignore
  // const session = await getSession(context.req, context.res);
  const session = await getSession({ req: context.req });

  if (!session?.user) return { props: { teams: [] } };

  console.log(session.user.id);
  const teams = await prisma.team.findMany({
    where: {
      user: {
        some: {
          id: session.user.id,
        },
      },
    },
  });

  return {
    props: {
      teams,
    },
  };
};

const TeamsPage = ({ teams }: { teams: Team[] }) => {
  // if( "name" in teams){
  // }

  const belongsToAteam = teams.length > 0;
  return (
    <div className="p-2">
      <h1>Teams Page</h1>
      {belongsToAteam &&
        teams.map((team) => (
          <div key={team.id} className="team-card mt-3">
            <Link href={`/teams/${team.id}`}>
              <a className="p-2">{team.name}</a>
            </Link>
          </div>
        ))}

      <style jsx>{`
        .team-card {
          cursor: pointer;
          display: inline-flex;
          border-radius: 2px;
          outline: 1px solid var(--primary-alpha-50);
        }
        .team-card:hover {
          outline: 1px solid var(--primary);
          background-color: var(--primary-alpha-20);
        }
        .team-card > a {
          //text-decoration: underline;
          font-weight: bold;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default TeamsPage;
