-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "drivetrain" TEXT,
ADD COLUMN     "engine" TEXT,
ADD COLUMN     "exteriorColor" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "gasMileage" TEXT,
ADD COLUMN     "interiorColor" TEXT,
ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transmission" TEXT,
ADD COLUMN     "trim" TEXT,
ADD COLUMN     "vehicleHistory" TEXT;
