import { OrderStatus, PaymentStatus } from "../generated/prisma/client";
import prisma from "./prisma";
import { transactionSequentiel, transactionUpdate } from "./transactions";


export async function testOrders() {

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

    if (!user) return null;

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
    return order;
  }

  // Création des commandes de test
  const goodOrder = await createOrder({
    userEmail: "fanny.brume@example.com",
    status: OrderStatus.CART,
    items: [
      { slug: "python-press", quantity: 1 },
      { slug: "boolean-brew", quantity: 2 },
    ],
  });

  const badOrder = await createOrder({
    userEmail: "emilie.velours@example.com",
    status: OrderStatus.CART,
    items: [
      { slug: "false-start-decaf", quantity: 40 },
      { slug: "csharp-shot", quantity: 2 },
    ],
  });
  return { goodOrder, badOrder };
}



async function testTransactions() {
  const { goodOrder, badOrder } = await testOrders();

  if (!goodOrder || !badOrder) {
    console.error("Erreur lors de la creation des commandes tests. Assurez-vous d'avoir seedé les données nécessaires avant de lancer les tests, avec la commande 'npx prisma db seed'. ");
    return;
  }

  const goodShipment = [
    { productId: "cmnt18l5w0004djsbf6t4g48p", amountReceived: 10 },
    { productId: "cmnt18l5w0005djsbb2wepdip", amountReceived: 10 },
    { productId: "cmnt18l5w000adjsb1srae48m", amountReceived: 10 },
  ]

  const badShipment = [
    { productId: "cmnt18l5w0004djsbf6t4g48p", amountReceived: 10 },
    { productId: "cmnt18l5w0005djsbb2wepdip", amountReceived: 10 },
    { productId: "cmnt18l5djsb1srae48m", amountReceived: 10 }, // Doesnt exists
  ]


  console.log("\n=== TEST 1 :  Commande reussi ===");
  await transactionUpdate(goodOrder.id);

  console.log("\n=== TEST 2 :  Commande rechouee (stock insufisant) ===");
  await transactionUpdate(badOrder.id);

  console.log("\n=== TEST 3 :  Update séquentielle reussi ===");
  await transactionSequentiel(goodShipment);

  console.log("\n=== TEST 4 :  Update séquentielle échoué ===");
  await transactionSequentiel(badShipment);



}

testTransactions();
