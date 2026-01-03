import type { RouterContextProvider } from "react-router";

export interface ServiceParams {
  context: Readonly<RouterContextProvider>;
  request: Request;
}