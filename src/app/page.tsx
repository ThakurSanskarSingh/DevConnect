'use client';
import { signOut, useSession, signIn } from "next-auth/react";

export default function Home() {
  const {data : session} = useSession();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        DevConnect
      </h1>

      {session ? (
        <>
          <p> Welcome, {session.user?.name}!</p>

          <button onClick={() => signOut()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Sign Out</button>
        </>
      ) : (
        <>
        <p>Please sign in to access DevConnect.</p>
        <button onClick={() => signIn("github")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Sign In with GitHub</button>
        </>
      )}
     </main>
  );
}
