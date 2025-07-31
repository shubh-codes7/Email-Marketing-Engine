import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  name: String,
  email: { type: String, required: true }
})

const contactListSchema = mongoose.Schema({
  name: { type: String, required: true },
  contacts: [contactSchema],
})

export default mongoose.model("ContactList", contactListSchema);