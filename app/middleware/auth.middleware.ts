import { RouterContextProvider } from "react-router";
import { assertIsLoggedIn } from "~/utils";

interface AuthServerMiddlewareParams {
  context: Readonly<RouterContextProvider>
}

export const authServerMiddleware = async ({
  context
}: AuthServerMiddlewareParams) => {
  assertIsLoggedIn(context, "/");
}
