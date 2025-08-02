import { Router } from "express";
import contactModel from "../models/ContactList.model.js";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
const upload = multer({ dest: "uploads/" });

export const contactListRouter = Router();

contactListRouter.post("/", upload.single("contacts"), async (req, res) => {
  try {
    const { name } = req.body;
    const filePath = req.file.path;
    const contacts = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        contacts.push({
          name: row.name || "Unknown",
          email: row.email,
        });
      })
      .on("end", async () => {
        fs.unlinkSync(filePath);

        const contactList = await contactModel.create({ name, contacts });

        res.status(201).json({ message: "Success", contactList });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating contactList" });
  }
});

contactListRouter.get("/", async (req, res) => {
  try {
    const contactList = await contactModel.find();
    res.status(200).json({ message: "Success", contactList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching contactList" });
  }
});
