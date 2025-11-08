import { Schema, models, model } from "mongoose";

const JournalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    mood: Number,
    text: String,
    gratitude: String,
    tags: [String],
    imageUrl: String,
  },
  { timestamps: true },
);

export default models.Journal || model("Journal", JournalSchema);
