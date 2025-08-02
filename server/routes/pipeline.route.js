import { Router } from "express";
import pipelineModel from '../models/Pipeline.model.js'

export const pipelineRouter = Router()

//fetch all pipelines
pipelineRouter.get('/', async (req, res) => {
  try{
    const pipelines = await pipelineModel.find()
    res.status(200).json({message: "Pipelines fetched successfully", pipelines})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error fetching pipeline"})
  }
})


//Create a new pipeline
pipelineRouter.post('/', async (req, res) => {
  try{
    const {name, steps, listname, contacts} = req.body
    const pipeline = await pipelineModel.create({name, steps, listname, contacts})
    res.status(201).json({message: "Pipelines created successfully", pipeline})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error creating pipeline"})
  }
})

