export function formatCurrency(amount: number): string {
  return `$${(amount ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function formatCurrencyWithGST(amount: number): { exGst: string; gst: string; incGst: string } {
  const gst = amount * 0.1;
  return {
    exGst: formatCurrency(amount),
    gst: formatCurrency(gst),
    incGst: formatCurrency(amount + gst),
  };
}
