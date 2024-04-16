/*
  Warnings:

  - Added the required column `expiry` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "expiry" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PasswordReset" ADD COLUMN     "expiry" TIMESTAMP(3) NOT NULL;
