import mongoose, { Schema, models } from "mongoose";

const JournalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    gratitude: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Journal = models.Journal || mongoose.model("Journal", JournalSchema);
export default Journal;
