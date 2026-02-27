import { Schema, model, Types } from "mongoose";
import { BookingStatus, PaymentStatus } from "../types/booking.type";

const BookingSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true, index: true },

    scheduledAt: { type: Date, required: true, index: true },
    note: { type: String, default: "" },
    addressText: { type: String, default: "" },

    price: { type: Number, default: 0 },

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

    rejectionReason: { type: String, default: "" },
    cancellationReason: { type: String, default: "" },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending_confirmation", "paid", "refunded"],
      default: "unpaid" as PaymentStatus,
    },
  },
  { timestamps: true }
);

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

export const BookingModel = model("Booking", BookingSchema);