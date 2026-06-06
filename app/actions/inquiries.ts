"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedAdminRoles = new Set(["SUPER_ADMIN", "INVENTORY_CONTENT_ADMIN"]);

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!role || !allowedAdminRoles.has(role)) {
    throw new Error("Unauthorized");
  }
}

function getInquiryId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing inquiry ID");
  return id;
}

export async function markInquiryRead(formData: FormData) {
  await requireAdmin();
  const id = getInquiryId(formData);

  await prisma.contactMessage.update({
    where: { id },
    data: { readAt: new Date() },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
}

export async function markInquiryUnread(formData: FormData) {
  await requireAdmin();
  const id = getInquiryId(formData);

  await prisma.contactMessage.update({
    where: { id },
    data: { readAt: null },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(formData: FormData) {
  await requireAdmin();
  const id = getInquiryId(formData);

  await prisma.contactMessage.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
}
