import { Schema, model } from "mongoose";
import { NotificationType } from "../types/notification.type";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["booking_request", "booking_confirmed", "booking_rejected", "booking_status_changed","rating_request"],
      required: true,
    },
    title: { type: String, default: "" },
    message: { type: String, default: "" },
    meta: { type: Schema.Types.Mixed, default: {} },

    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", default: null, index: true },

    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const NotificationModel = model("Notification", NotificationSchema);
