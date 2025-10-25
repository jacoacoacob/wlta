import { Outlet } from "react-router";
import { GlobalHeader } from "~/features/GlobalHeader";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh w-dvw flex flex-col">
      <GlobalHeader suppressNav isLoggedIn={false} />
      <div className="flex-1 flex justify-center items-center">
        <div className="w-2xs">
          <Outlet />
        </div>
      </div>
    </div>
  )
}