import mongoose from "mongoose";

const directorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parentDirId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Directory",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    strict: "throw",
    timestamps: true,
  },
);

const Directory = mongoose.model("Directory", directorySchema);

export default Directory;
