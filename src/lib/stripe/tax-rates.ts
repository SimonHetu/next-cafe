import Stripe from "stripe";
import { GST_RATE, QST_RATE } from "../tax";

interface TaxRateDef {
  displayName: string;
  description: string;
  percentage: number;
  jurisdiction: string;
}

const TAX_RATE_DEFS: TaxRateDef[] = [
  {
    displayName: "GST",
    description: "Goods and Services Tax",
    percentage: 5,
    jurisdiction: "CA-QC",
  },
  {
    displayName: "QST",
    description: "Quebec Sales Tax",
    percentage: 9.975,
    jurisdiction: "CA-QC",
  },
];

let cachedIds: string[] | null = null;

export async function getStripeTaxRateIds(
  stripe: Stripe
): Promise<string[]> {
  if (cachedIds) return cachedIds;

  const existing = await stripe.taxRates.list({ limit: 100, active: true });

  const ids: string[] = [];

  for (const def of TAX_RATE_DEFS) {
    const match = existing.data.find(
      (r) => r.display_name === def.displayName && r.active
    );

    if (match) {
      ids.push(match.id);
    } else {
      const created = await stripe.taxRates.create({
        display_name: def.displayName,
        description: def.description,
        percentage: def.percentage,
        inclusive: false,
        jurisdiction: def.jurisdiction,
        country: "CA",
      });
      ids.push(created.id);
    }
  }

  cachedIds = ids;
  return ids;
}
