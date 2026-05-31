CREATE TABLE "VehicleMake" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleMake_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VehicleModel" (
    "id" TEXT NOT NULL,
    "makeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VehicleMake_name_key" ON "VehicleMake"("name");
CREATE INDEX "VehicleMake_name_idx" ON "VehicleMake"("name");
CREATE INDEX "VehicleMake_source_sourceId_idx" ON "VehicleMake"("source", "sourceId");
CREATE UNIQUE INDEX "VehicleModel_makeId_name_key" ON "VehicleModel"("makeId", "name");
CREATE INDEX "VehicleModel_name_idx" ON "VehicleModel"("name");
CREATE INDEX "VehicleModel_source_sourceId_idx" ON "VehicleModel"("source", "sourceId");

ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_makeId_fkey"
FOREIGN KEY ("makeId") REFERENCES "VehicleMake"("id") ON DELETE CASCADE ON UPDATE CASCADE;
