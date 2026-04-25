"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CarStatus } from "../generated/prisma/enums";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export type CarActionState =
  | { error: string }
  | undefined;

export async function addCar(
  _prevState: CarActionState,
  formData: FormData
): Promise<CarActionState> {
  await requireAdmin();

  const make = (formData.get("make") as string)?.trim();
  const model = (formData.get("model") as string)?.trim();
  const yearStr = formData.get("year") as string;
  const mileageStr = formData.get("mileage") as string;
  const priceStr = formData.get("price") as string;
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const status = formData.get("status") as CarStatus;

  if (!make || !model || !yearStr || !mileageStr || !priceStr || !imageUrl || !status) {
    return { error: "All fields are required." };
  }

  const year = parseInt(yearStr, 10);
  const mileage = parseInt(mileageStr, 10);
  const price = parseFloat(priceStr);

  if (isNaN(year) || isNaN(mileage) || isNaN(price)) {
    return { error: "Year, mileage, and price must be valid numbers." };
  }

  if (price < 0 || mileage < 0) {
    return { error: "Price and mileage must be positive values." };
  }

  if (year < 1900 || year > new Date().getFullYear() + 1) {
    return { error: "Please enter a valid year." };
  }

  if (!["AVAILABLE", "SOLD"].includes(status)) {
    return { error: "Invalid status." };
  }

  try {
    await prisma.car.create({
      data: { make, model, year, mileage, price, imageUrl, status },
    });
  } catch {
    return { error: "Failed to save car listing. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateCar(
  id: string,
  _prevState: CarActionState,
  formData: FormData
): Promise<CarActionState> {
  await requireAdmin();

  const make = (formData.get("make") as string)?.trim();
  const model = (formData.get("model") as string)?.trim();
  const yearStr = formData.get("year") as string;
  const mileageStr = formData.get("mileage") as string;
  const priceStr = formData.get("price") as string;
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const status = formData.get("status") as CarStatus;

  if (!make || !model || !yearStr || !mileageStr || !priceStr || !imageUrl || !status) {
    return { error: "All fields are required." };
  }

  const year = parseInt(yearStr, 10);
  const mileage = parseInt(mileageStr, 10);
  const price = parseFloat(priceStr);

  if (isNaN(year) || isNaN(mileage) || isNaN(price)) {
    return { error: "Year, mileage, and price must be valid numbers." };
  }

  if (price < 0 || mileage < 0) {
    return { error: "Price and mileage must be positive values." };
  }

  if (year < 1900 || year > new Date().getFullYear() + 1) {
    return { error: "Please enter a valid year." };
  }

  if (!["AVAILABLE", "SOLD"].includes(status)) {
    return { error: "Invalid status." };
  }

  try {
    await prisma.car.update({
      where: { id },
      data: { make, model, year, mileage, price, imageUrl, status },
    });
  } catch {
    return { error: "Failed to update car listing. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/cars/${id}`);
  redirect("/admin");
}

export async function deleteCar(id: string): Promise<void> {
  await requireAdmin();

  try {
    await prisma.car.delete({ where: { id } });
  } catch {
    throw new Error("Failed to delete car listing.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export type InterestState = 
  | { error: string }
  | { success: true }
  | null;

export async function interestAction(
  prevState: InterestState,
  formData: FormData
): Promise<InterestState> {
  const carId = formData.get('carId') as string;
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!carId || !name || !email || !message) {
    return { error: "All fields are required." };
  }

  if (!email.includes('@')) {
    return { error: "Please enter a valid email address." };
  }

  try {
    // Log interest to a new Prisma model or console for now
    console.log('Interest submitted:', { carId, name, email, message });
    
    // TODO: Save to DB or send email
    // await prisma.interestInquiry.create({
    //   data: { carId, name, email, message }
    // });
    
  } catch (error) {
    console.error('Interest submission error:', error);
    return { error: "Failed to submit interest. Please try again." };
  }

  return { success: true };
}
