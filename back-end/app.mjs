import express from "express";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'; 

const app = express();

// Connecting to the OpenAI api
const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
})
const openai = new OpenAIApi(configuration);

app.listen(
	process.env.PORT || 5000,
	console.log(`Server starting at ${process.env.PORT || 5000}`)
);