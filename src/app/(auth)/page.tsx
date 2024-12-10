import { LoginForm } from "@/app/(auth)/_components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LOGIN_REDIRECT_ROLE } from "@/data/const";
import { getSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect(LOGIN_REDIRECT_ROLE[session.user.role]);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu código para ingresar a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
