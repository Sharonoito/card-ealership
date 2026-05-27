import "dotenv/config";
import { prisma } from "../lib/prisma.ts";

const SOURCE = "NHTSA_VPIC";
const API_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";
const REQUEST_DELAY_MS = Number(process.env.NHTSA_IMPORT_DELAY_MS ?? 75);
const MAKE_LIMIT = Number(process.env.NHTSA_IMPORT_MAKE_LIMIT ?? 0);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeName(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NHTSA request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function getAllMakes() {
  const data = await fetchJson(`${API_BASE}/GetAllMakes?format=json`);
  return (data.Results ?? [])
    .map((make) => ({
      sourceId: String(make.Make_ID ?? ""),
      name: normalizeName(make.Make_Name),
    }))
    .filter((make) => make.sourceId && make.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getModelsForMakeId(makeId) {
  const data = await fetchJson(`${API_BASE}/GetModelsForMakeId/${makeId}?format=json`);
  return (data.Results ?? [])
    .map((model) => ({
      sourceId: String(model.Model_ID ?? ""),
      name: normalizeName(model.Model_Name),
    }))
    .filter((model) => model.name);
}

async function main() {
  const allMakes = await getAllMakes();
  const makes = MAKE_LIMIT > 0 ? allMakes.slice(0, MAKE_LIMIT) : allMakes;

  console.log(`Importing ${makes.length} vehicle makes from NHTSA vPIC...`);

  let modelCount = 0;

  for (const [index, make] of makes.entries()) {
    const savedMake = await prisma.vehicleMake.upsert({
      where: { name: make.name },
      update: {
        source: SOURCE,
        sourceId: make.sourceId,
        importedAt: new Date(),
      },
      create: {
        name: make.name,
        source: SOURCE,
        sourceId: make.sourceId,
      },
    });

    const models = await getModelsForMakeId(make.sourceId);
    for (const model of models) {
      await prisma.vehicleModel.upsert({
        where: {
          makeId_name: {
            makeId: savedMake.id,
            name: model.name,
          },
        },
        update: {
          source: SOURCE,
          sourceId: model.sourceId || null,
          importedAt: new Date(),
        },
        create: {
          makeId: savedMake.id,
          name: model.name,
          source: SOURCE,
          sourceId: model.sourceId || null,
        },
      });
      modelCount += 1;
    }

    console.log(`${index + 1}/${makes.length}: ${make.name} (${models.length} models)`);
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`Done. Imported/updated ${makes.length} makes and ${modelCount} models.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
