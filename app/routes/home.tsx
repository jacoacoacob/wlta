import { deriveIsLoggedIn } from "~/utils";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { GlobalHeader } from "~/features/GlobalHeader";
import { ProfileMenu } from "~/features/ProfileMenu";

export function meta() {
  return [
    { title: "Work and Leisure Time Tracker" },
    { name: "description", content: "Track how you spend your time!" },
  ];
}

export async function loader({ context }: Route.ClientLoaderArgs) {
  return {
    isLoggedIn: deriveIsLoggedIn(context)
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { isLoggedIn } = loaderData;

  return (
    <div className="min-h-dvh w-dvw flex flex-col">
      <GlobalHeader
        rightNavContent={
          <div>
            <ProfileMenu isLoggedIn={isLoggedIn} />
          </div>
        }
      />
      <div className="flex-1 flex flex-col gap-2 justify-center items-center">
        <h1>Welcome to the Work and Leisure Time Tracker!</h1>
        {isLoggedIn ? (
          <div>
            Go to your <Link className="underline" to="/dashboard">Dashboard</Link>.
          </div>
        ) : (
          <div>
            <Link className="underline" to="/login">Sign in</Link> to get started.
          </div>
        )}
      </div>
    </div>
  );
}
