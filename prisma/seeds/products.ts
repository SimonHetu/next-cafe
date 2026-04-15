import prisma from "@/src/lib/prisma";
import { RoastLevel } from "../../src/generated/prisma/client";

export async function seedProducts() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Python Press',
        slug: 'python-press',
        description: 'Indentation so smooth it just flows',
        price: 10,
        stockQuantity: 30,
        roastLevel: RoastLevel.LIGHT,
      },
      {
        name: 'Ruby Roast',
        slug: 'ruby-roast',
        description: 'Optimized for happiness, not just caffeine',
        price: 13,
        stockQuantity: 16,
        roastLevel: RoastLevel.MEDIUM,
      },
      {
        name: 'Go Brew',
        slug: 'go-brew',
        description: 'Fast, efficient, no time to sleep',
        price: 11,
        stockQuantity: 28,
        roastLevel: RoastLevel.LIGHT,
      },
      {
        name: 'C Brew',
        slug: 'c-brew',
        description: 'No sugar, no safety, just pure power',
        price: 11,
        stockQuantity: 24,
        roastLevel: RoastLevel.DARK,
      },
      {
        name: 'C++ Press',
        slug: 'cpp-press',
        description: 'Twice the caffeine, twice the complexity',
        price: 14,
        stockQuantity: 21,
        roastLevel: RoastLevel.DARK,
      },
      {
        name: 'C# Shot',
        slug: 'csharp-shot',
        description: 'Sharp, clean, and hits exactly where needed',
        price: 13,
        stockQuantity: 20,
        roastLevel: RoastLevel.MEDIUM,
      },
      {
        name: 'Azure Blend',
        slug: 'azure-blend',
        description: 'Scalable flavor for distributed mornings',
        price: 12,
        stockQuantity: 22,
        roastLevel: RoastLevel.MEDIUM,
      },
      {
        name: 'Boolean Brew',
        slug: 'boolean-brew',
        description: 'True energy or false hope — no in-between',
        price: 10,
        stockQuantity: 26,
        roastLevel: RoastLevel.MEDIUM,
      },
      {
        name: 'True Roast',
        slug: 'true-roast',
        description: 'Evaluates to true every single morning',
        price: 12,
        stockQuantity: 19,
        roastLevel: RoastLevel.DARK,
      },
      {
        name: 'False Start Decaf',
        slug: 'false-start-decaf',
        description: 'Looks like coffee, crashes on launch',
        price: 9,
        stockQuantity: 14,
        roastLevel: RoastLevel.LIGHT,
      },
      {
        name: 'Null Brew Exception',
        slug: 'null-brew-exception',
        description: 'No coffee. No context. No purpose.',
        price: 15,
        stockQuantity: 12,
        roastLevel: RoastLevel.DARK,
      },
    ],
  })
}