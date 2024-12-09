import { redirect, RedirectType } from "next/navigation";

export default function EditPage() {
  redirect("/pedidos", RedirectType.replace);
}
