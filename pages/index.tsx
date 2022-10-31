import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { NextResponse, NextRequest } from "next/server";
import LoginButton from "../components/LoginButton";
import AccessToken from "../components/AccessToken";
import { useSession } from "next-auth/react";

// GetServerSideProps<{
//   teams: {
//     id: number;
//     name: string;
//   }[];
// }>

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  return {
    props: {
      teams: [
        { id: 1, name: "A Team" },
        { id: 2, name: "B Team" },
      ],
    },
  };
};

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { data, status } = useSession();
  return (
    <div>
      <Head>
        <title>Fudap</title>
        <meta name="description" content="Simple planning for basic needs" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <LoginButton />

        <AccessToken />
      </main>

      {/* {"teams" in props && (
        <>
          {props.teams.map((team) => (
            <p key={team.id}>
              <Link href={`/teams/${team.id}`}>{team.name}</Link>
            </p>
          ))}
        </>
      )} */}

      {data && (
        <div className="mt-3">
          {" "}
          <Link href="/teams">go to teams</Link>{" "}
        </div>
      )}

      {/* <footer>App footer</footer> */}
    </div>
  );
};

export default Home;
