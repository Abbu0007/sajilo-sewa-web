import { Schema, model, Types } from "mongoose";

const RatingSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },

    // who is giving the rating
    raterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // who is being rated
    rateeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // client rates provider OR provider rates client
    raterRole: { type: String, enum: ["client", "provider"], required: true, index: true },
    rateeRole: { type: String, enum: ["client", "provider"], required: true, index: true },

    stars: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// prevent multiple ratings from same rater for same booking
RatingSchema.index({ bookingId: 1, raterId: 1 }, { unique: true });

export type RatingDoc = {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  raterId: Types.ObjectId;
  rateeId: Types.ObjectId;
  raterRole: "client" | "provider";
  rateeRole: "client" | "provider";
  stars: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const RatingModel = model("Rating", RatingSchema);