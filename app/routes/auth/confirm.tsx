import type { Route } from "./+types/login";
import { supabaseContext } from "~/context";
import { Form, redirect } from "react-router";
import { assertIsNotLoggedIn, isString } from "~/utils";
import { InputField } from "~/patterns";

export async function loader({ context }: Route.LoaderArgs) {
  assertIsNotLoggedIn(context);
}

export async function action({ context, request }: Route.ActionArgs) {
  const requestUrl = new URL(request.url);

  const email = requestUrl.searchParams.get("email");

  const formData = await request.formData();

  const token = formData.get("token");

  if (isString(email) && isString(token)) {
    const supabase = context.get(supabaseContext);

    console.log("Verifying email and OTP token", { email, token });

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    })

    if (error) {
      return { error: error.message };
    }

    return redirect("/dashboard");
  }

  console.error(
    "Error verifying token: email and token must be strings",
    { email, token }
  );

  return {
    error: "Error verifying token",
  }
}

export default function AuthConfirm({ actionData }: Route.ComponentProps) {
  const { error } = actionData ?? {};

  return (
    <>
      <pre>
        {JSON.stringify(error, null, 2)}
      </pre>
      <Form method="post">
        <InputField name="token" type="text" label="Token" />
        <button type="submit">Verify</button>
      </Form>
    </>
  )
}