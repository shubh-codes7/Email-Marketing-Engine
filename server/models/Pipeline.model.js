import mongoose from "mongoose";

const stepSchema = mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
  delay: { type: Number, required: true, default: 0 } 
});

const pipelineSchema = mongoose.Schema({
  name: { type: String, required: true },
  steps: [stepSchema],
  contactListId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ContactList",
  },
});

export default mongoose.model("Pipeline", pipelineSchema);
