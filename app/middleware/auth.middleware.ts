import { RouterContextProvider } from "react-router";
import { getAssertIsLoggedIn } from "~/utils";

interface AuthServerMiddlewareParams {
  context: Readonly<RouterContextProvider>
}

export const authServerMiddleware = async ({
  context
}: AuthServerMiddlewareParams) => {
  getAssertIsLoggedIn(context, "/");
}
