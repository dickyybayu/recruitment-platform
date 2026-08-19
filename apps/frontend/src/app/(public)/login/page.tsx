import Link from "next/link";

import {
  LoginForm,
} from "@/components/auth/login-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-2 p-6">
          <CardTitle className="text-2xl tracking-tight">
            Sign in
          </CardTitle>

          <CardDescription>
            Sign in to manage your recruitment process.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6">
          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium underline underline-offset-4"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
