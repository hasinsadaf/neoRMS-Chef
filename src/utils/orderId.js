export function getDisplayOrderId(orderId) {
  if (!orderId) return "N/A";

  const value = String(orderId);
  const [firstSegment] = value.split("-");

  return firstSegment || value;
}
