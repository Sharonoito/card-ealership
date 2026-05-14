"use server";

import { prisma } from "@/lib/prisma";

export type ContactActionState =
  | { error: string; success?: never }
  | { success: true; error?: never }
  | undefined;

const inquiryTypes = new Set([
  "New Vehicle Acquisition",
  "Auction Deposit Help",
  "Selling a Vehicle",
  "General Inquiry",
]);

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function sendEmailNotification(input: {
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Novashift Contact <onboarding@resend.dev>";

  if (!apiKey || !to) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: input.email,
      subject: `New contact inquiry: ${input.inquiryType}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone ?? "Not provided"}`,
        `Inquiry Type: ${input.inquiryType}`,
        "",
        input.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("Resend contact email failed:", await response.text());
  }
}

export async function sendContactMessage(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const name = clean(formData.get("name"));
  const email = clean(formData.get("email"));
  const phone = clean(formData.get("phone")) || null;
  const inquiryType = clean(formData.get("inquiryType"));
  const message = clean(formData.get("message"));

  if (!name || !email || !inquiryType || !message) {
    return { error: "Please fill in your name, email, inquiry type, and message." };
  }

  if (!email.includes("@") || email.length < 5) {
    return { error: "Please enter a valid email address." };
  }

  if (!inquiryTypes.has(inquiryType)) {
    return { error: "Please choose a valid inquiry type." };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        inquiryType,
        message,
      },
    });

    await sendEmailNotification({ name, email, phone, inquiryType, message });
  } catch (error) {
    console.error("Contact message failed:", error);
    return { error: "We could not send your message. Please try again." };
  }

  return { success: true };
}
