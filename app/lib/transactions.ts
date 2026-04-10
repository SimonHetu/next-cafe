// Tr
import { prisma } from "../prisma";

export async function createProductWithCategory(
    categoryName: string,
    productData: { name: string; price: number; stock: number }
) {
    try {
        // Les deux operations reussissent OU echouent ensemble
        const [category, product] = await prisma.$transaction([

    prisma.category.create({
        data: { name: categoryName, slug: categoryName.toLowerCase() },
    }),
    prisma.product.create({
    data: {
    ...productData,
categoryId: "temp", // sera lie apres
},
}),
]);

return { success: true, category, product };
} catch (error) {
return { success: false, error: (error as Error).message };
}
}