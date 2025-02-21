-- CreateTable
CREATE TABLE "QRCode" (
    "id" TEXT NOT NULL,
    "qrImage" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);
