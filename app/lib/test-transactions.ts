
import { prisma } from "./prisma";
import { createOrder } from "./transactions";

async function testTransactions() {

console.log("=== TEST 1 : Commande reussie ===");
// Verifier le stock AVANT
// Executer la transaction
// Verifier le stock APRES (doit avoir diminue)
// Verifier que la commande existe
console.log("\n=== TEST 2 : Commande echouee (stock insuffisant) ===")
;
// Tenter de commander plus que le stock disponible
// Verifier que la transaction a echoue
// Verifier que le stock est INCHANGE
// Verifier qu’aucune commande n’a ete creee
console.log("\n=== RESULTATS ===");
// Afficher un resume : X tests passes / Y tests au total
testTransactions()


.catch(console.error)
.finally(() => prisma.$disconnect());