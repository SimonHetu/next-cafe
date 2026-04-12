
import prisma from "./prisma";

interface ShipmentEntry {
  productId: string,
  amountReceived: number,
}

// Contexte : Le client reçoit des commandes chaque semaine. 
// Nous lui avons écrit un script qui permet d'analyser la facture et d'extraire 
// tout ce qui entre en stock. On utilise une transaction pour ajuster les stocks 
// car si une des mises à jour échoue, le client devrait sinon déterminer ce qui a été ajusté ou non.

export const transactionSequentiel = async (
  shipment: ShipmentEntry[]
) => {
  try {
    const q = shipment.map(s =>
      prisma.product.update({
        where: { id: s.productId },
        data: {
          stockQuantity: {
            increment: s.amountReceived
          }
        }
      })
    )
    console.log("Transaction successful");
    await prisma.$transaction(q)
  } catch (e) {
    console.error("Transaction failed:", e);
  }
}


// Transaction interactive
export async function transactionUpdate(
  orderId: string,) {
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!order) {
        throw new Error("Order not found");
      }
      for (const item of order.items) {
        const productQty = item.product.stockQuantity;
        console.log(`Product ${item.product.name} has ${productQty} in stock, needs ${item.quantity}`);
        if (productQty >= item.quantity) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: productQty - item.quantity },
          });
        } else {
          throw new Error(`Not enough stock for product ${item.product.name}`);
        }
        console.log(`Product ${item.product.name} current stock after update: ${productQty - item.quantity} `);
      }
      const orderUpdated = await tx.order.update({
        where: { id: orderId },
        data: { status: "PENDING" },
      });
      console.log("Transaction successful, order updated:", orderUpdated);
      return orderUpdated;
    });
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}
