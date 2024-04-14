-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GENERAL');

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';
