import prisma from "@/src/lib/prisma";
import { OrderStatus, PaymentStatus } from "../../src/generated/prisma/client";

// Seed de commandes avec items et snapshot de livraison
export async function seedOrders() {

  // Récupère les users et produits existants
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  // Helper pour trouver user/product
  const getUser = (email: string) =>
    users.find((u) => u.email === email);

  const getProduct = (slug: string) =>
    products.find((p) => p.slug === slug);

  // Création de commande
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

    let subtotal = 0;

    // Création initiale
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status,
        // Paiement dépend du status
        paymentStatus: status === OrderStatus.CART ? PaymentStatus.UNPAID : PaymentStatus.PAID,
        subtotal: 0,
        shippingCost: 5,
        total: 0,
      },
    });

    // Ajout des items
    for (const item of items) {
      const product = getProduct(item.slug);
      if (!product) continue;

      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;

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

    // Calcul du total final
    const total = subtotal + 5;

    // Mise à jour de la commande avec les totaux + snapshot shipping
    await prisma.order.update({
      where: { id: order.id },
      data: {
        subtotal,
        total,
        // Snapshot des infos de livraison si commande validée
        ...(status !== OrderStatus.CART && {
          shippingFirstName: user.firstName,
          shippingLastName: user.lastName,
          shippingLine1: "123 Rue du Café",
          shippingCity: "Montréal",
          shippingStateProvince: "QC",
          shippingPostalCode: "H2X 1Y4",
          shippingCountry: "Canada",
        }),
      },
    });
  }

  // Création des commandes de test
  await createOrder({
    userEmail: "stephanie.cafeine@example.com",
    status: OrderStatus.CART,
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
