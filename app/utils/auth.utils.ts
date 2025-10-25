import { redirect, type RouterContextProvider } from "react-router";
import { sessionContext } from "~/context";
import { isNull } from "./typeguards";

export function deriveIsLoggedIn(context: Readonly<RouterContextProvider>) {
  const user = context.get(sessionContext);

  return !isNull(user);
}

/**
 * If user session data extracted from {@link sessionContext} is null, throws a 
 * {@link redirect} to `redirectPath`. Otherwise, returns user data.
 * @param context 
 * @param redirectPath defaults to `"/login"`
 */
export function assertIsLoggedIn(
  context: Readonly<RouterContextProvider>,
  redirectPath: string = "/login"
) {
  const user = context.get(sessionContext);

  if (!user) {
    throw redirect(redirectPath)
  }

  return user;
}

/**
 * If user session data extracted from {@link sessionContext} is not null,
 * throws redirect to `redirectPath`
 * @param context 
 * @param redirectPath defaults to `"/"`
 */
export function assertIsNotLoggedIn(
  context: Readonly<RouterContextProvider>,
  redirectPath: string = "/"
) {
  const isLoggedIn = deriveIsLoggedIn(context);
  
  if (isLoggedIn) {
    throw redirect(redirectPath)
  }
}