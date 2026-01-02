import type { Route } from "../+types/root";

export const loggingServerMiddleware: Route.MiddlewareFunction = async ({
  request
}) => {
  const url = new URL(request.url);

  console.log(
    `${new Date().toISOString()} ${request.method} ${url.pathname}`
  ); 
}