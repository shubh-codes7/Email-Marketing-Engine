import { Router } from "express";
import Template from '../models/EmailTemplate.model.js'

export const templateRouter = Router()


//create template
templateRouter.post('/', async (req, res) => {
  try {
    const {name, subject, htmlContent} = req.body
    const template = await Template.create({name, subject, htmlContent})
    res.status(201).json({message: "Template created successfully", template})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error creating template"})
  }
})


//get all templates
templateRouter.get('/', async (req, res) => {
  try {
    const templates = await Template.find()
    res.status(200).json({message: "Templates fetched successfully", templates})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error fetching templates"})
  }
})