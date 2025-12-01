import { Form, redirect } from "react-router";

import type { Route } from "./+types/login";
import { sessionContext, supabaseContext } from "~/context";
import { isString } from "~/utils";
import { InputField } from "~/patterns/Field";

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  if (session) {
    return redirect("/");
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (isString(email)) {
    const supabase = context.get(supabaseContext);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      return { error: error.message }
    }

    return redirect(`/auth/confirm?email=${encodeURIComponent(email)}`);
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const { error } = actionData ?? {};

  return (
    <div className="">
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(error, null, 2)}
      </pre>
      <Form method="post">
        <InputField name="email" type="email" label="Email" />
        <button type="submit">Login</button>
      </Form>
    </div>
  )
}
