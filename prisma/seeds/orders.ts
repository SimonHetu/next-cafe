import { PrismaClient, OrderStatus, PaymentStatus } from "../../app/generated/prisma/client";

export async function seedOrders(prisma: PrismaClient) {
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  const getUser = (email: string) =>
    users.find((u) => u.email === email);

  const getProduct = (slug: string) =>
    products.find((p) => p.slug === slug);

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

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status,
        paymentStatus: status === OrderStatus.CART ? PaymentStatus.UNPAID : PaymentStatus.PAID,
        subtotal: 0,
        shippingCost: 5,
        total: 0,
      },
    });

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

    const total = subtotal + 5;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        subtotal,
        total,
        // snapshot shipping si pas CART
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