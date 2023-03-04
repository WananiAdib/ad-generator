import express from "express";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import * as fs from 'fs'
dotenv.config()
const app = express();

// Connecting to the OpenAI api
const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt = "Hey I have an event on Monday 13th March in Puxi for networking event for nyu students as part of the business club.";

try {
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: `
		{
			"title" : "",
			"description": "",
			"image_prompt": "",
			"date": "",
			"location": ""
		  }
		  from the prompt: ${prompt}
		  
		  Fill the json above. title would be the title of the poster. description a very small marketing hook. image_prompt a detailed description of the background photo, should not include text. fill out date and location. Return the JSON object only.`,
		  max_tokens: 256
	});
	console.log(completion.data.choices[0].text);
	const result = JSON.parse(completion.data.choices[0].text)
	console.log(result)
	const image = await openai.createImage({
		prompt: result.image_prompt,
		n: 1,
		size: "1024x1024"
	});

	const url = image.data.data[0].url
	console.log(url);

	const background = await fetch(url);
	const raw = await background.blob();
	const buffer = Buffer.from(await raw.arrayBuffer())

	fs.writeFileSync(`./img/${Date.now()}.png`, buffer);

} catch (error) {
	if (error.response) {
		console.log(error.response.status);
		console.log(error.response.data);
	} else {
		console.log(error.message);
	}
}

// const image_prompt = "A photo of a group of businesspeople shaking hands and smiling. The colors in the photo should have a warm and inviting look."
// console.log(completion.data.choices[0].text);

// try {
	


// }catch(error){
// 	if (error.response) {
// 		console.log(error.response.status);
// 		console.log(error.response.data);
// 	} else {
// 		console.log(error.message);
// 	}
// }


app.listen(
	process.env.PORT || 5001,
	console.log(`Server starting at ${process.env.PORT || 5000}`)
);







