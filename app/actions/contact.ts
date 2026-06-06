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

function isTooLong(value: string, maxLength: number) {
  return value.length > maxLength;
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

  if (
    isTooLong(name, 120) ||
    isTooLong(email, 254) ||
    (phone && isTooLong(phone, 40)) ||
    isTooLong(message, 4000)
  ) {
    return { error: "Please shorten your message and try again." };
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

export async function sendVehicleInquiry(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const name = clean(formData.get("name"));
  const email = clean(formData.get("email"));
  const phone = clean(formData.get("phone")) || null;
  const carId = clean(formData.get("carId"));
  const carModel = clean(formData.get("carModel"));
  const message = clean(formData.get("message")) || "Client requested a call-back.";

  if (!name || !email || !carId || !carModel) {
    return { error: "Please fill in your name and email address." };
  }

  if (
    isTooLong(name, 120) ||
    isTooLong(email, 254) ||
    (phone && isTooLong(phone, 40)) ||
    isTooLong(carId, 80) ||
    isTooLong(carModel, 200) ||
    isTooLong(message, 4000)
  ) {
    return { error: "Please shorten your inquiry and try again." };
  }

  if (!email.includes("@") || email.length < 5) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { id: true, year: true, make: true, model: true, price: true },
    });

    if (!car) {
      return { error: "We could not find this vehicle. Please refresh and try again." };
    }

    const vehicleLabel = `${car.year} ${car.make} ${car.model}`;
    const fullMessage = [
      `Vehicle inquiry for: ${vehicleLabel}`,
      `Vehicle ID: ${car.id}`,
      `Listed price: ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(car.price)}`,
      "",
      message,
    ].join("\n");

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        inquiryType: "Vehicle Inquiry",
        message: fullMessage,
      },
    });

    await sendEmailNotification({
      name,
      email,
      phone,
      inquiryType: `Vehicle Inquiry: ${vehicleLabel}`,
      message: fullMessage,
    });
  } catch (error) {
    console.error("Vehicle inquiry failed:", error);
    return { error: "We could not send your inquiry. Please try again." };
  }

  return { success: true };
}
