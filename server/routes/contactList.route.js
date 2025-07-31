import { Router } from "express";
import contactModel from '../models/ContactList.model.js'

export const contactListRouter = Router()

contactListRouter.get('/', async (req, res) => {
  try {
    const contactList = await contactModel.find()
    res.status(200).json({message: "Success", contactList})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error fetching contactList"})
  }
})


contactListRouter.post('/', async (req, res) => {
  try {
    const {name, contacts} = req.body
    const contactList = await contactModel.create({name, contacts})
    res.status(201).json({message: "Success", contactList})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error creating contactList"})
  }
})