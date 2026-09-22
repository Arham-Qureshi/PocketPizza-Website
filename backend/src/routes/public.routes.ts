import { Router } from 'express';
import { z } from 'zod';
import type {
  Category,
  MenuItem,
  MenuResponse,
  ProductDetailResponse,
} from '@pokket-pizza/contract/contract';
import { getPrisma } from '../config/database';
import { ah } from '../utils/async-handler';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { toFixed2 } from '../utils/decimal';

const cuidParamSchema = z.object({
  id: z.string().regex(/^c[0-9a-z]{20,}$/, 'Not a valid CUID'),
});

type Money = { toString(): string };

type VariantRow = { id: string; label: string; priceDelta: Money };
type AddOnRow = { id: string; label: string; price: Money };
type ItemRow = {
  id: string;
  name: string;
  description: string | null;
  basePrice: Money;
  imageUrl: string | null;
  isVeg: boolean;
  variants: VariantRow[];
  addOns: AddOnRow[];
};
type CategoryRow = {
  id: string;
  name: string;
  sortOrder: number;
  items: ItemRow[];
};

const money = (value: Money): string => toFixed2(value.toString());

function serializeMenuItem(item: ItemRow): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    basePrice: money(item.basePrice),
    imageUrl: item.imageUrl,
    isVeg: item.isVeg,
    variants: item.variants.map((variant) => ({
      id: variant.id,
      label: variant.label,
      priceDelta: money(variant.priceDelta),
    })),
    addOns: item.addOns.map((addOn) => ({
      id: addOn.id,
      label: addOn.label,
      price: money(addOn.price),
    })),
  };
}

function serializeCategory(category: CategoryRow): Category {
  return {
    id: category.id,
    name: category.name,
    sortOrder: category.sortOrder,
    items: category.items.map(serializeMenuItem),
  };
}

export const publicRouter = Router();

publicRouter.get(
  '/menu',
  ah(async (_req, res) => {
    const prisma = await getPrisma();

    const restaurant = await prisma.restaurant.findFirst({
      select: { id: true },
    });

    if (!restaurant) {
      const empty: MenuResponse = { categories: [] };
      sendSuccess(res, empty);
      return;
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId: restaurant.id, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          include: {
            variants: { orderBy: { priceDelta: 'asc' } },
            addOns: { where: { isActive: true }, orderBy: { id: 'asc' } },
          },
        },
      },
    });

    const body: MenuResponse = {
      categories: categories.map(serializeCategory),
    };
    sendSuccess(res, body);
  }),
);

publicRouter.get(
  '/products/:id',
  ah(async (req, res) => {
    const { id } = cuidParamSchema.parse({ id: req.params.id });

    const prisma = await getPrisma();

    const restaurant = await prisma.restaurant.findFirst({
      select: { id: true },
    });

    const item = restaurant
      ? await prisma.menuItem.findFirst({
          where: { id, restaurantId: restaurant.id, isActive: true },
          include: {
            variants: { orderBy: { priceDelta: 'asc' } },
            addOns: { where: { isActive: true }, orderBy: { id: 'asc' } },
          },
        })
      : null;

    if (!item) throw new NotFoundError('Product');

    const body: ProductDetailResponse = serializeMenuItem(item);
    sendSuccess(res, body);
  }),
);
