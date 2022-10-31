import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();

  const [userData, setUserData] = React.useState(null);

  const doFetch = async () => {
    const res = await fetch("/api/fetchid");
    const data = await res.json();
    setUserData(data);
  };

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        {/* <button onClick={doFetch}>fetch user</button> */}
        <pre>{JSON.stringify(userData, null, 2)}</pre>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("google")}>Sign in</button>
    </>
  );
}
