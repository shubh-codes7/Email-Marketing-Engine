import mongoose from "mongoose";

export default async function connectDb(){
  try{
    await mongoose.connect(process.env.DB_URI)
    console.log("DB Connected")
  }catch(error){
    console.log(error)
    process.exit(1)
  }
}