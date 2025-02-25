/*
  Warnings:

  - You are about to drop the column `qrImage` on the `QRCode` table. All the data in the column will be lost.
  - Added the required column `qrImageData` to the `QRCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QRCode" DROP COLUMN "qrImage",
ADD COLUMN     "qrImageData" TEXT NOT NULL;
