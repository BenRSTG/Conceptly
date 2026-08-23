import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin-Login" };

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="font-script text-3xl text-anthracite">Admin-Login</h1>
      {error === "forbidden" && (
        <p className="mt-3 text-sm text-red-600">
          Dieser Account hat keine Admin-Berechtigung.
        </p>
      )}
      <LoginForm />
    </div>
  );
}
