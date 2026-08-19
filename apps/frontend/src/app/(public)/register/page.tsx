import Link from "next/link";

import {
  RegisterForm,
} from "@/components/auth/register-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-2 p-6">
          <CardTitle className="text-2xl tracking-tight">
            Create company account
          </CardTitle>

          <CardDescription>
            Register your company and create the first admin account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6">
          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
