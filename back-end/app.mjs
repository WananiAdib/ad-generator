import express from "express";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as QRCode from "qrcode";

dotenv.config();
const app = express();

// Connecting to the OpenAI api
const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt =
	"Hey I have an event on Monday 13th March in Puxi for networking event for nyu students as part of the business club.";

const event_url = "https://engage.shanghai.nyu.edu/event/8917833";

try {
	// Completion by GPT-3
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
		  
		  Fill the json above. title would be the title of the poster. description a very small marketing hook. image_prompt a detailed description of the background photo. fill out date and location. Return the JSON object only.`,
		max_tokens: 256,
	});
	const result = JSON.parse(completion.data.choices[0].text);
	console.log(result);

	// Image generation by Dall-E-2
	const image = await openai.createImage({
		prompt: `${result.image_prompt}. Do not include text in the photo`,
		n: 1,
		size: "1024x1024",
	});
	const url = image.data.data[0].url;

	// Downloading image
	const background = await fetch(url);
	const raw = await background.blob();
	const buffer = Buffer.from(await raw.arrayBuffer());
	fs.writeFileSync(`./img/${Date.now()}.png`, buffer);

	// QRCode generation
	QRCode.toFile(
		`./qrcodes/${Date.now()}.png`,
		event_url,
		{
			errorCorrectionLevel: "H",
			type: "png",
			margin: 2,
		},
		function (err, QRcode) {
			if (err) return console.log("error occurred");

			// Printing the generated code
			console.log(QRcode);
		}
	);
} catch (error) {
	if (error.response) {
		console.log(error.response.status);
		console.log(error.response.data);
	} else {
		console.log(error.message);
	}
}

app.listen(
	process.env.PORT || 5001,
	console.log(`Server starting at ${process.env.PORT || 5001}`)
);
