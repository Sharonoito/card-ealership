"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isSupportedImageUrl, normalizeImageUrl } from "@/lib/imageUrls";
import { prisma } from "@/lib/prisma";
import { saveCarImageFilesToPublicCars } from "@/app/lib/uploadCarImages";

type CarStatusValue = "AVAILABLE" | "SOLD";
type AdminRoleValue = "SUPER_ADMIN" | "INVENTORY_CONTENT_ADMIN";

function nonEmptyImageFiles(formData: FormData, field: string): File[] {
  return (formData.getAll(field) as unknown[]).filter(
    (v): v is File => v instanceof File && v.size > 0
  );
}

function optionalText(formData: FormData, field: string) {
  return (formData.get(field) as string | null)?.trim() ?? "";
}

function parseCsvUrls(value: string) {
  return value
    .split(",")
    .map((s) => normalizeImageUrl(s))
    .filter(Boolean);
}

function hasInvalidImageUrl(urls: string[]) {
  return urls.some((url) => !isSupportedImageUrl(url));
}

function uniqueImageUrls(urls: string[]) {
  return Array.from(new Set(urls.filter(Boolean)));
}

async function requireAdminRole(allowedRoles: AdminRoleValue[]) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const role = (session.user as { role?: AdminRoleValue } | undefined)?.role;
  if (!role || !allowedRoles.includes(role)) {
    throw new Error("Forbidden");
  }
}


export type CarActionState =
  | { error: string }
  | undefined;

export async function addCar(
  _prevState: CarActionState,
  formData: FormData
): Promise<CarActionState> {
  await requireAdminRole([
    "SUPER_ADMIN",
    "INVENTORY_CONTENT_ADMIN",
  ]);

  const make = (formData.get("make") as string)?.trim();
  const model = (formData.get("model") as string)?.trim();
  const yearStr = formData.get("year") as string;
  const mileageStr = formData.get("mileage") as string;
  const priceStr = formData.get("price") as string;
  const imageUrl = normalizeImageUrl(optionalText(formData, "imageUrl"));
  const interiorImageUrl = normalizeImageUrl(optionalText(formData, "interiorImageUrl"));
  const status = formData.get("status") as CarStatusValue;

  const thumbnailRaw = formData.get("thumbnailFile");
  const thumbnailFile =
    thumbnailRaw instanceof File && thumbnailRaw.size > 0 ? thumbnailRaw : null;
  const interiorRaw = formData.get("interiorImageFile");
  const interiorImageFile =
    interiorRaw instanceof File && interiorRaw.size > 0 ? interiorRaw : null;
  const additionalImageFiles = nonEmptyImageFiles(formData, "additionalImageFiles");
  const additionalImagesRaw = optionalText(formData, "additionalImages");

  if (!make || !model || !yearStr || !mileageStr || !priceStr || !status) {
    return { error: "All fields are required." };
  }

  // Primary/body image can be either a URL or an uploaded file.
  if (!imageUrl && !thumbnailFile) {
    return { error: "Primary car body image is required (URL or upload)." };
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

  // Optional fields
  const bodyType = (formData.get("bodyType") as string)?.trim() || null;
  const transmission = (formData.get("transmission") as string)?.trim() || null;
  const fuelType = (formData.get("fuelType") as string)?.trim() || null;
  const condition = (formData.get("condition") as string)?.trim() || null;
  const exteriorColor = (formData.get("exteriorColor") as string)?.trim() || null;
  const interiorColor = (formData.get("interiorColor") as string)?.trim() || null;
  const trim = (formData.get("trim") as string)?.trim() || null;
  const drivetrain = (formData.get("drivetrain") as string)?.trim() || null;
  const engine = (formData.get("engine") as string)?.trim() || null;
  const vehicleHistory = (formData.get("vehicleHistory") as string)?.trim() || null;
  const gasMileage = (formData.get("gasMileage") as string)?.trim() || null;
  const isNew = formData.get("isNew") === "true";
  const features = (formData.get("features") as string)?.split(",").map(f => f.trim()).filter(Boolean) || [];

  const additionalImageUrlsFromCsv = parseCsvUrls(additionalImagesRaw);
  if (hasInvalidImageUrl([imageUrl, interiorImageUrl, ...additionalImageUrlsFromCsv].filter(Boolean))) {
    return { error: "Image URLs must start with http://, https://, or /." };
  }

  const [uploadedThumbnailUrl] = thumbnailFile
    ? await saveCarImageFilesToPublicCars([thumbnailFile])
    : [undefined];

  const [uploadedInteriorUrl] = interiorImageFile
    ? await saveCarImageFilesToPublicCars([interiorImageFile])
    : [undefined];

  const uploadedAdditionalUrls = additionalImageFiles.length
    ? await saveCarImageFilesToPublicCars(additionalImageFiles)
    : [];

  const resolvedThumbnailUrl = uploadedThumbnailUrl || imageUrl;
  if (!resolvedThumbnailUrl) {
    return { error: "Primary car body image is required (URL or upload)." };
  }

  try {
    const created = await prisma.car.create({
      data: {
        make,
        model,
        year,
        mileage,
        price,
        imageUrl: resolvedThumbnailUrl,
        status,
        bodyType,
        transmission,
        fuelType,
        condition,
        exteriorColor,
        interiorColor,
        trim,
        drivetrain,
        engine,
        vehicleHistory,
        gasMileage,
        isNew,
        features,
      },
      select: { id: true },
    });

    const interiorUrl = uploadedInteriorUrl || interiorImageUrl;
    const galleryUrls = uniqueImageUrls([
      interiorUrl,
      ...additionalImageUrlsFromCsv,
      ...uploadedAdditionalUrls,
    ]);

    // position 0 is the primary body image; position 1 is the interior image when supplied.
    await prisma.carImage.createMany({
      data: [
        {
          carId: created.id,
          url: resolvedThumbnailUrl,
          position: 0,
        },
        ...galleryUrls.map((url, idx) => ({
          carId: created.id,
          url,
          position: idx + 1,
        })),
      ],
      skipDuplicates: true,
    });

  } catch (err) {
    console.error("addCar() failed:", err);
    return {
      error:
        err instanceof Error
          ? `Failed to save car listing. ${err.message}`
          : `Failed to save car listing. ${String(err)}`,
    };
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
  await requireAdminRole([
    "SUPER_ADMIN",
    "INVENTORY_CONTENT_ADMIN",
  ]);


  const make = (formData.get("make") as string)?.trim();
  const model = (formData.get("model") as string)?.trim();
  const yearStr = formData.get("year") as string;
  const mileageStr = formData.get("mileage") as string;
  const priceStr = formData.get("price") as string;
  const imageUrl = normalizeImageUrl(optionalText(formData, "imageUrl"));
  const interiorImageUrl = normalizeImageUrl(optionalText(formData, "interiorImageUrl"));
  const status = formData.get("status") as CarStatusValue;

  if (!make || !model || !yearStr || !mileageStr || !priceStr || !status) {
    return { error: "All fields are required." };
  }

  // Allow thumbnail to be either existing imageUrl OR new upload; require at least one.
  const thumbnailRaw = formData.get("thumbnailFile");
  const thumbnailFile =
    thumbnailRaw instanceof File && thumbnailRaw.size > 0 ? thumbnailRaw : null;
  const interiorRaw = formData.get("interiorImageFile");
  const interiorImageFile =
    interiorRaw instanceof File && interiorRaw.size > 0 ? interiorRaw : null;
  const additionalImageFiles = nonEmptyImageFiles(formData, "additionalImageFiles");
  const additionalImagesRaw = optionalText(formData, "additionalImages");

  if (!imageUrl && !thumbnailFile) {
    return { error: "Primary car body image is required (URL or upload)." };
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

  // Optional fields
  const bodyType = (formData.get("bodyType") as string)?.trim() || null;
  const transmission = (formData.get("transmission") as string)?.trim() || null;
  const fuelType = (formData.get("fuelType") as string)?.trim() || null;
  const condition = (formData.get("condition") as string)?.trim() || null;
  const exteriorColor = (formData.get("exteriorColor") as string)?.trim() || null;
  const interiorColor = (formData.get("interiorColor") as string)?.trim() || null;
  const trim = (formData.get("trim") as string)?.trim() || null;
  const drivetrain = (formData.get("drivetrain") as string)?.trim() || null;
  const engine = (formData.get("engine") as string)?.trim() || null;
  const vehicleHistory = (formData.get("vehicleHistory") as string)?.trim() || null;
  const gasMileage = (formData.get("gasMileage") as string)?.trim() || null;
  const isNew = formData.get("isNew") === "true";
  const features = (formData.get("features") as string)?.split(",").map(f => f.trim()).filter(Boolean) || [];

  // Thumbnail file/url can be updated; gallery defaults to APPEND new images.
  const additionalImageUrlsFromCsv = parseCsvUrls(additionalImagesRaw);
  if (hasInvalidImageUrl([imageUrl, interiorImageUrl, ...additionalImageUrlsFromCsv].filter(Boolean))) {
    return { error: "Image URLs must start with http://, https://, or /." };
  }

  const [uploadedThumbnailUrl] = thumbnailFile
    ? await saveCarImageFilesToPublicCars([thumbnailFile])
    : [undefined];

  const [uploadedInteriorUrl] = interiorImageFile
    ? await saveCarImageFilesToPublicCars([interiorImageFile])
    : [undefined];

  const uploadedAdditionalUrls = additionalImageFiles.length
    ? await saveCarImageFilesToPublicCars(additionalImageFiles)
    : [];

  const resolvedThumbnailUrl = uploadedThumbnailUrl || imageUrl;
  if (!resolvedThumbnailUrl) {
    return { error: "Primary car body image is required (URL or upload)." };
  }

  try {
    await prisma.car.update({
      where: { id },
      data: { make, model, year, mileage, price, imageUrl: resolvedThumbnailUrl, status, bodyType, transmission, fuelType, condition, exteriorColor, interiorColor, trim, drivetrain, engine, vehicleHistory, gasMileage, isNew, features },
    });

    const interiorUrl = uploadedInteriorUrl || interiorImageUrl;
    const galleryUrls = uniqueImageUrls([
      interiorUrl,
      ...additionalImageUrlsFromCsv,
      ...uploadedAdditionalUrls,
    ]);

    await prisma.carImage.deleteMany({ where: { carId: id } });
    await prisma.carImage.createMany({
      data: [
        { carId: id, url: resolvedThumbnailUrl, position: 0 },
        ...galleryUrls.map((url, idx) => ({
          carId: id,
          url,
          position: idx + 1,
        })),
      ],
      skipDuplicates: true,
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
  await requireAdminRole([
    "SUPER_ADMIN",
    "INVENTORY_CONTENT_ADMIN",
  ]);


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
