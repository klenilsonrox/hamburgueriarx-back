/*
  Warnings:

  - You are about to drop the column `type` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "type",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDENTE';

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "OrderType";
