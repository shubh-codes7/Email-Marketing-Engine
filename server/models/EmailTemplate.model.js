import mongoose from "mongoose";

const templateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  htmlBody: {
    type: String,
    required: true
  }
})

export default mongoose.model('Template', templateSchema)