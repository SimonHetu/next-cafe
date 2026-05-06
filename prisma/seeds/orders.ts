import prisma from "@/src/lib/prisma";
import { OrderStatus, PaymentStatus } from "../../src/generated/prisma/client";

// Seed de commandes avec items
export async function seedOrders() {

  // Récupère les users et produits existants
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  // Helper pour trouver user/product
  const getUser = (email: string) =>
    users.find((u) => u.email === email);

  const getProduct = (slug: string) =>
    products.find((p) => p.slug === slug);

  // Création d'une commande confirmée avec items
  async function createOrder({
    userEmail,
    status,
    items,
  }: {
    userEmail: string;
    status: OrderStatus;
    items: { slug: string; quantity: number }[];
  }) {
    const user = getUser(userEmail);
    if (!user) return;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status,
        paymentStatus: status === OrderStatus.CART ? PaymentStatus.UNPAID : PaymentStatus.PAID,
      },
    });

    for (const item of items) {
      const product = getProduct(item.slug);
      if (!product) continue;

      await prisma.item.create({
        data: {
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
        },
      });
    }
  }

  // Création des commandes de test
  await createOrder({
    userEmail: "stephanie.cafeine@example.com",
    status: OrderStatus.DELIVERED,
    items: [
      { slug: "python-press", quantity: 1 },
      { slug: "boolean-brew", quantity: 2 },
    ],
  });

  await createOrder({
    userEmail: "lucien.boise@example.com",
    status: OrderStatus.CONFIRMED,
    items: [
      { slug: "ruby-roast", quantity: 1 },
      { slug: "csharp-shot", quantity: 1 },
    ],
  });

  await createOrder({
    userEmail: "camille.noisette@example.com",
    status: OrderStatus.DELIVERED,
    items: [
      { slug: "go-brew", quantity: 2 },
    ],
  });
}
