export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";
