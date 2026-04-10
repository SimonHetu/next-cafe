
import prisma from "./prisma";

// Transaction interactive
export async function transactionUpdate(
    orderId: string,) {
        try {
            await prisma.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { items: {
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
