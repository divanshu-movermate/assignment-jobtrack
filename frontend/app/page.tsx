import { redirect } from "next/navigation";

// TODO(intern): once auth exists, decide whether this should redirect to
// /jobs (if logged in) or /login (if not) instead of always going to /login.
export default function Home() {
  redirect("/login");
}
