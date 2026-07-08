/*
  Warnings:

  - You are about to drop the column `paymentInterval` on the `contracts` table. All the data in the column will be lost.
  - Added the required column `paymentTxt` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentValue` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
ALTER TABLE "contracts" RENAME column "paymentInterval" TO "paymentTxt";
ALTER TABLE "contracts" ADD COLUMN "paymentValue" INTEGER NOT NULL;
