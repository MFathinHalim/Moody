import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  image: String,
});

const modelList = mongoose.models || {};

const User = modelList.User || mongoose.model("User", UserSchema);

export default User;
