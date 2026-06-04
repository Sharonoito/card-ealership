"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as XLSX from "xlsx";
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
    .split(/[;,]/)
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

export type BulkCarUploadState =
  | {
      error?: string;
      success?: string;
      rowErrors?: string[];
    }
  | undefined;

const bulkCarColumns = [
  "make",
  "model",
  "year",
  "mileage",
  "price",
  "imageUrl",
  "status",
  "bodyType",
  "transmission",
  "fuelType",
  "condition",
  "exteriorColor",
  "interiorColor",
  "trim",
  "drivetrain",
  "engine",
  "vehicleHistory",
  "gasMileage",
  "isNew",
  "features",
  "interiorImageUrl",
  "additionalImages",
  "titleStatus",
  "inspectionStatus",
  "biddingStatus",
  "marketStatus",
  "location",
] as const;

const requiredBulkColumns = ["make", "model", "year", "mileage", "price", "imageUrl"];
const maxBulkUploadBytes = 10 * 1024 * 1024;

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsvRows(text: string) {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let currentLine = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      currentLine += char + next;
      i += 1;
      continue;
    }

    if (char === '"') inQuotes = !inQuotes;

    if (char === "\n" && !inQuotes) {
      if (currentLine.trim()) rows.push(parseCsvLine(currentLine));
      currentLine = "";
      continue;
    }

    currentLine += char;
  }

  if (currentLine.trim()) rows.push(parseCsvLine(currentLine));
  return rows;
}

async function parseBulkUploadRows(file: File) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".csv")) {
    return parseCsvRows(await file.text());
  }

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const workbook = XLSX.read(await file.arrayBuffer(), {
      cellDates: false,
      type: "array",
    });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) return [];

    const sheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json<string[]>(sheet, {
      blankrows: false,
      defval: "",
      header: 1,
      raw: false,
    });
  }

  throw new Error("Unsupported file type.");
}

function getRowValue(row: Record<string, string>, column: string) {
  return row[column]?.trim() ?? "";
}

function parseBulkBoolean(value: string) {
  return ["true", "yes", "y", "1", "new"].includes(value.trim().toLowerCase());
}

function parseBulkFeatures(value: string) {
  return value
    .split(/[;,]/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function optionalBulkValue(row: Record<string, string>, column: string) {
  return getRowValue(row, column) || null;
}

function normalizeVehicleName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

async function validateVehicleCatalogEntry(make: string, model: string) {
  const catalogCount = await prisma.vehicleMake.count();
  if (catalogCount === 0) return null;

  const catalogMake = await prisma.vehicleMake.findFirst({
    where: { name: { equals: make, mode: "insensitive" } },
    include: {
      models: {
        where: { name: { equals: model, mode: "insensitive" } },
        take: 1,
      },
    },
  });

  if (!catalogMake) {
    return `Unknown vehicle make: "${make}". Choose a make from the verified catalog.`;
  }

  if (!catalogMake.models.length) {
    return `Unknown model "${model}" for ${catalogMake.name}. Choose a model from the verified catalog.`;
  }

  return null;
}

export async function addCar(
  _prevState: CarActionState,
  formData: FormData
): Promise<CarActionState> {
  await requireAdminRole([
    "SUPER_ADMIN",
    "INVENTORY_CONTENT_ADMIN",
  ]);

  const make = normalizeVehicleName((formData.get("make") as string) ?? "");
  const model = normalizeVehicleName((formData.get("model") as string) ?? "");
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

  const catalogError = await validateVehicleCatalogEntry(make, model);
  if (catalogError) return { error: catalogError };

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
  const titleStatus = optionalText(formData, "titleStatus") || null;
  const inspectionStatus = optionalText(formData, "inspectionStatus") || null;
  const biddingStatus = optionalText(formData, "biddingStatus") || null;
  const marketStatus = optionalText(formData, "marketStatus") || null;
  const location = optionalText(formData, "location") || null;
  const features = (formData.get("features") as string)?.split(",").map(f => f.trim()).filter(Boolean) || [];

  const additionalImageUrlsFromCsv = parseCsvUrls(additionalImagesRaw);
  if (hasInvalidImageUrl([imageUrl, interiorImageUrl, ...additionalImageUrlsFromCsv].filter(Boolean))) {
    return { error: "Image URLs must start with https:// or /." };
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
        titleStatus,
        inspectionStatus,
        biddingStatus,
        marketStatus,
        location,
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

export async function bulkUploadCars(
  _prevState: BulkCarUploadState,
  formData: FormData
): Promise<BulkCarUploadState> {
  await requireAdminRole([
    "SUPER_ADMIN",
    "INVENTORY_CONTENT_ADMIN",
  ]);

  const upload = formData.get("bulkFile");
  if (!(upload instanceof File) || upload.size === 0) {
    return { error: "Please choose a .xlsx, .xls, or .csv file." };
  }

  if (upload.size > maxBulkUploadBytes) {
    return { error: "Bulk upload files must be 10MB or smaller." };
  }

  const fileName = upload.name.toLowerCase();
  if (!/\.(csv|xlsx|xls)$/.test(fileName)) {
    return {
      error:
        "Please upload a .xlsx, .xls, or .csv file.",
    };
  }

  let rows: string[][];
  try {
    rows = await parseBulkUploadRows(upload);
  } catch {
    return { error: "Could not read that file. Please upload a valid Excel or CSV file." };
  }

  if (rows.length < 2) {
    return { error: "The upload needs a header row and at least one car row." };
  }

  const headers = rows[0].map((header) => header.trim());
  const normalizedHeaders = headers.map((header) => header.toLowerCase());
  const headerLookup = new Map<string, number>();
  normalizedHeaders.forEach((header, index) => headerLookup.set(header, index));

  const missingRequiredColumns = requiredBulkColumns.filter(
    (column) => !headerLookup.has(column.toLowerCase())
  );

  if (missingRequiredColumns.length) {
    return {
      error: `Missing required columns: ${missingRequiredColumns.join(", ")}.`,
    };
  }

  const rowErrors: string[] = [];
  const validRows: Array<{
    make: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    imageUrl: string;
    status: CarStatusValue;
    bodyType: string | null;
    transmission: string | null;
    fuelType: string | null;
    condition: string | null;
    exteriorColor: string | null;
    interiorColor: string | null;
    trim: string | null;
    drivetrain: string | null;
    engine: string | null;
    vehicleHistory: string | null;
    gasMileage: string | null;
    isNew: boolean;
    features: string[];
    interiorImageUrl: string;
    additionalImages: string;
    titleStatus: string | null;
    inspectionStatus: string | null;
    biddingStatus: string | null;
    marketStatus: string | null;
    location: string | null;
  }> = [];

  rows.slice(1).forEach((cells, index) => {
    const rowNumber = index + 2;
    const row: Record<string, string> = {};

    for (const column of bulkCarColumns) {
      const columnIndex = headerLookup.get(column.toLowerCase());
      row[column] = columnIndex === undefined ? "" : cells[columnIndex] ?? "";
    }

    const missingValues = requiredBulkColumns.filter((column) => !getRowValue(row, column));
    if (missingValues.length) {
      rowErrors.push(`Row ${rowNumber}: missing ${missingValues.join(", ")}.`);
      return;
    }

    const year = parseInt(getRowValue(row, "year"), 10);
    const mileage = parseInt(getRowValue(row, "mileage"), 10);
    const price = parseFloat(getRowValue(row, "price"));
    const statusValue = (getRowValue(row, "status") || "AVAILABLE").toUpperCase();
    const imageUrl = normalizeImageUrl(getRowValue(row, "imageUrl"));
    const interiorImageUrl = normalizeImageUrl(getRowValue(row, "interiorImageUrl"));
    const additionalImages = getRowValue(row, "additionalImages");
    const additionalImageUrls = parseCsvUrls(additionalImages);

    if (!Number.isFinite(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      rowErrors.push(`Row ${rowNumber}: year must be between 1900 and ${new Date().getFullYear() + 1}.`);
      return;
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
      rowErrors.push(`Row ${rowNumber}: mileage must be a positive number.`);
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      rowErrors.push(`Row ${rowNumber}: price must be a positive number.`);
      return;
    }

    if (!["AVAILABLE", "SOLD"].includes(statusValue)) {
      rowErrors.push(`Row ${rowNumber}: status must be AVAILABLE or SOLD.`);
      return;
    }

    if (hasInvalidImageUrl([imageUrl, interiorImageUrl, ...additionalImageUrls].filter(Boolean))) {
      rowErrors.push(`Row ${rowNumber}: image URLs must start with https:// or /.`);
      return;
    }

    validRows.push({
      make: normalizeVehicleName(getRowValue(row, "make")),
      model: normalizeVehicleName(getRowValue(row, "model")),
      year,
      mileage,
      price,
      imageUrl,
      status: statusValue as CarStatusValue,
      bodyType: optionalBulkValue(row, "bodyType"),
      transmission: optionalBulkValue(row, "transmission"),
      fuelType: optionalBulkValue(row, "fuelType"),
      condition: optionalBulkValue(row, "condition"),
      exteriorColor: optionalBulkValue(row, "exteriorColor"),
      interiorColor: optionalBulkValue(row, "interiorColor"),
      trim: optionalBulkValue(row, "trim"),
      drivetrain: optionalBulkValue(row, "drivetrain"),
      engine: optionalBulkValue(row, "engine"),
      vehicleHistory: optionalBulkValue(row, "vehicleHistory"),
      gasMileage: optionalBulkValue(row, "gasMileage"),
      isNew: parseBulkBoolean(getRowValue(row, "isNew")),
      features: parseBulkFeatures(getRowValue(row, "features")),
      interiorImageUrl,
      additionalImages,
      titleStatus: optionalBulkValue(row, "titleStatus"),
      inspectionStatus: optionalBulkValue(row, "inspectionStatus"),
      biddingStatus: optionalBulkValue(row, "biddingStatus"),
      marketStatus: optionalBulkValue(row, "marketStatus"),
      location: optionalBulkValue(row, "location"),
    });
  });

  if (!validRows.length) {
    return {
      error: "No cars were imported. Fix the row issues and upload again.",
      rowErrors: rowErrors.slice(0, 12),
    };
  }

  try {
    const catalogCount = await prisma.vehicleMake.count();
    if (catalogCount > 0) {
      for (const [index, row] of validRows.entries()) {
        const catalogError = await validateVehicleCatalogEntry(row.make, row.model);
        if (catalogError) {
          rowErrors.push(`Imported row ${index + 1}: ${catalogError}`);
        }
      }

      if (rowErrors.length) {
        return {
          error: "Some uploaded rows do not match the verified vehicle catalog.",
          rowErrors: rowErrors.slice(0, 12),
        };
      }
    }

    await prisma.$transaction(
      validRows.map((row) => {
        const galleryUrls = uniqueImageUrls([
          row.interiorImageUrl,
          ...parseCsvUrls(row.additionalImages),
        ]);

        return prisma.car.create({
          data: {
            make: row.make,
            model: row.model,
            year: row.year,
            mileage: row.mileage,
            price: row.price,
            imageUrl: row.imageUrl,
            status: row.status,
            bodyType: row.bodyType,
            transmission: row.transmission,
            fuelType: row.fuelType,
            condition: row.condition,
            exteriorColor: row.exteriorColor,
            interiorColor: row.interiorColor,
            trim: row.trim,
            drivetrain: row.drivetrain,
            engine: row.engine,
            vehicleHistory: row.vehicleHistory,
            gasMileage: row.gasMileage,
            isNew: row.isNew,
            titleStatus: row.titleStatus,
            inspectionStatus: row.inspectionStatus,
            biddingStatus: row.biddingStatus,
            marketStatus: row.marketStatus,
            location: row.location,
            features: row.features,
            images: {
              create: [
                { url: row.imageUrl, position: 0 },
                ...galleryUrls.map((url, index) => ({
                  url,
                  position: index + 1,
                })),
              ],
            },
          },
        });
      })
    );
  } catch (err) {
    console.error("bulkUploadCars() failed:", err);
    return {
      error:
        err instanceof Error
          ? `Bulk upload failed. ${err.message}`
          : `Bulk upload failed. ${String(err)}`,
      rowErrors: rowErrors.slice(0, 12),
    };
  }

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/admin");

  const skipped = rowErrors.length ? ` ${rowErrors.length} row(s) were skipped.` : "";
  return {
    success: `Imported ${validRows.length} car${validRows.length === 1 ? "" : "s"}.${skipped}`,
    rowErrors: rowErrors.slice(0, 12),
  };
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


  const make = normalizeVehicleName((formData.get("make") as string) ?? "");
  const model = normalizeVehicleName((formData.get("model") as string) ?? "");
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

  const catalogError = await validateVehicleCatalogEntry(make, model);
  if (catalogError) return { error: catalogError };

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
  const titleStatus = optionalText(formData, "titleStatus") || null;
  const inspectionStatus = optionalText(formData, "inspectionStatus") || null;
  const biddingStatus = optionalText(formData, "biddingStatus") || null;
  const marketStatus = optionalText(formData, "marketStatus") || null;
  const location = optionalText(formData, "location") || null;
  const features = (formData.get("features") as string)?.split(",").map(f => f.trim()).filter(Boolean) || [];

  // Thumbnail file/url can be updated; gallery defaults to APPEND new images.
  const additionalImageUrlsFromCsv = parseCsvUrls(additionalImagesRaw);
  if (hasInvalidImageUrl([imageUrl, interiorImageUrl, ...additionalImageUrlsFromCsv].filter(Boolean))) {
    return { error: "Image URLs must start with https:// or /." };
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
      data: { make, model, year, mileage, price, imageUrl: resolvedThumbnailUrl, status, bodyType, transmission, fuelType, condition, exteriorColor, interiorColor, trim, drivetrain, engine, vehicleHistory, gasMileage, isNew, titleStatus, inspectionStatus, biddingStatus, marketStatus, location, features },
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
