// TODO(intern): real login form (react-hook-form + zod) posting to
// /api/auth/login, storing the returned token/cookie, redirecting to /jobs
// on success. See docs/assignment-brief.md Section 8.
export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-paper p-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8 shadow-sm">
        <h1 className="font-heading text-xl font-semibold text-ink">Log in</h1>
        <p className="mt-2 text-sm text-ink-muted">TODO: build the login form here.</p>
      </div>
    </div>
  );
}
