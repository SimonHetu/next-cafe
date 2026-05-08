export const GST_RATE = 0.05;
export const QST_RATE = 0.09975;

export function calculateTaxes(subtotal: number) {
  const gst = subtotal * GST_RATE;
  const qst = subtotal * QST_RATE;
  return {
    subtotal,
    gst: Math.round(gst * 100) / 100,
    qst: Math.round(qst * 100) / 100,
    total: Math.round((subtotal + gst + qst) * 100) / 100,
  };
}
