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
const modelList = mongoose.models || {};

const Journal = modelList.Journal || mongoose.model("Journal", JournalSchema);
export default Journal;
