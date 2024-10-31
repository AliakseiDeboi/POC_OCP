import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now },
});

export default model("Counter", counterSchema);