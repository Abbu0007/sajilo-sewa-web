import { Schema, model, Types } from "mongoose";
import { BookingStatus, PaymentStatus } from "../types/booking.type";

// Booking schema
const BookingSchema = new Schema(
  {
    // Client who created the booking
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Provider assigned to the booking
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Service requested
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true, index: true },

    // Scheduled service time
    scheduledAt: { type: Date, required: true, index: true },

    // Client note
    note: { type: String, default: "" },

    // Service address
    addressText: { type: String, default: "" },

    // Service price
    price: { type: Number, default: 0 },

    // Booking status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "rejected",
        "in_progress",
        "awaiting_payment_confirmation",
        "completed",
        "cancelled",
      ],
      default: "pending" as BookingStatus,
      index: true,
    },

    // Reason for rejection
    rejectionReason: { type: String, default: "" },

    // Reason for cancellation
    cancellationReason: { type: String, default: "" },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending_confirmation", "paid", "refunded"],
      default: "unpaid" as PaymentStatus,
    },
  },
  { timestamps: true }
);

// Booking document type
export type BookingDoc = {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  providerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  scheduledAt: Date;
  note?: string;
  addressText?: string;
  price: number;
  status: BookingStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  paymentStatus: PaymentStatus;
};

// Booking model
export const BookingModel = model("Booking", BookingSchema);