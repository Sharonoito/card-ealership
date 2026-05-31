import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const allowedAdminRoles = new Set(["SUPER_ADMIN", "INVENTORY_CONTENT_ADMIN"]);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string } | undefined)?.role;
  if (!role || !allowedAdminRoles.has(role)) redirect("/login");

  return <>{children}</>;
}
