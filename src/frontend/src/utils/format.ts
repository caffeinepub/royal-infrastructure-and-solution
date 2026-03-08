export function formatINR(amount: bigint | number): string {
  const num = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatArea(sqft: bigint | number): string {
  const num = typeof sqft === "bigint" ? Number(sqft) : sqft;
  return `${num.toLocaleString("en-IN")} sq.ft`;
}
