
# Email OTP Flow

## Pages

### `/login`

Sign user in and create them if they don't exist yet.

- Call [`supabase.auth.signInWithOtp`](https://supabase.com/docs/reference/javascript/auth-signinwithotp).
  - If no error, redirect to [`/auth/confirm`](#authconfirm).
  - If error, ask the user to try again

### `/auth/confirm`

Prompt user to enter token from email and
- Call (`supabase.auth.verifyOtp`)[https://supabase.com/docs/reference/javascript/auth-verifyotp].
  - If success, redirect to `/`
  - If error...


### `/logout`

Log user out and redirect to `/`