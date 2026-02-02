import { logger } from '@/config';
import { ProductPriceInfo } from '@/types/product';
import { Product } from '@root/generated/prisma/client';
import createHttpError from 'http-errors';
import { StockNotificationService } from '../notification/stock-notification-service';

export function checkProductExistence(
  productName: string,
  product: Partial<Product> | null,
): asserts product is Product {
  if (!product) throw new createHttpError.NotFound(`${productName} Not Found.`);
}

export function checkStock(productName: string, obj: { stock: number } | null): number {
  logger.info(obj);
  if (obj?.stock === undefined || obj?.stock === null)
    throw new createHttpError.NotFound(`${productName} stock report not found.`);
  return obj.stock;
}

export function isThereEnoughStock(productName: string, currentStock: number, quantity: number) {
  if (quantity > currentStock)
    throw new createHttpError.BadRequest(
      `The requested quantity of ${productName} is greater than the available stock.`,
    );
}

export function isLowStock(
  productName: string,
  branchName: string,
  currentStock: number,
  threshold: number,
) {
  if (currentStock < threshold) {
    logger.info(`Branch ${branchName} has low stock of product ${productName}.`);
    new StockNotificationService().createLowStockNotification(productName, branchName);
  }
}

export function checkCostPerUnit(
  productName: string,
  item: ProductPriceInfo | undefined,
): asserts item is ProductPriceInfo {
  if (item?.costPerUnit === undefined || item?.costPerUnit === null)
    throw new createHttpError.BadRequest(`Failed to get ${productName} cost per unit value`);
}

export function checkSellingPrice(
  productName: string,
  item: ProductPriceInfo | undefined,
): asserts item is ProductPriceInfo {
  if (item?.sellingPrice === undefined || item?.sellingPrice === null)
    throw new createHttpError.BadRequest(`Failed to get ${productName} cost per unit value`);
}
