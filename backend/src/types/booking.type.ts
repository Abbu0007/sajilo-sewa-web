export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "in_progress"
  | "awaiting_payment_confirmation"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "pending_confirmation"
  | "paid"
  | "refunded";