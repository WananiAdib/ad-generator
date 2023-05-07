import express from "express";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as QRCode from "qrcode";
import sharp from "sharp";

dotenv.config();
const app = express();

// Connecting to the OpenAI api
const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

// const prompt = "There's gonna be an event in NYU Shanghai. The event is going to be a Pitch Night come and hear NYU Shanghai students pitch their startup in front of jury of Professional Chinese and western Investors & entrepreneurs - on May 11, 2023 at 6 PM Room E403 for 2 hours - The event will be public. Show some students in colorful manner presenting the pitch"
const prompt = "Pitch Night come and hear NYU Shanghai students pitch their startup in front of jury of Professional Chinese and western Investors and entrepreneurs - on May 11, 2023 at 6 PM Room E403 for 2 hours - The event will be public. The photo should be par style about the event. the title should be Pitch Night"
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
		prompt: `${result.image_prompt}. Do not include text, do not show faces. Abstract style`,
		n: 1,
		size: "1024x1024",
	});
	const url = image.data.data[0].url;

	// Downloading image
	const background = await fetch(url);
	const raw = await background.blob();
	const buffer = Buffer.from(await raw.arrayBuffer());
	const imageName = `./img/${Date.now()}.png`;
	fs.writeFileSync(imageName, buffer);

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
	// Sharp area
	const width = 1024;
	const height = 1024;

	const svgText = `
	<svg width="1024" height="1366" xmlns="http://www.w3.org/2000/svg">
			<style>
			.title { fill: white; font-size: 85px}
			.title2 { fill: white; font-size: 40px}
		.title3 { fill: white; font-size: 20px}
			</style>
	  <rect width="1024" height="171" x="0" y="0" />
	  <rect width="1024" height="171" x="0" y="1195" />
	  <text x = "20" y = "80" class = "title">${result.title || ""}</text>
	  <text x = "20" y = "140" class = "title2">${result.date || ""}</text>
		<text x = "20" y = "1245" class = "title2">${result.location || ""}</text>
	  <text x = "20" y = "1290" class = "title3">${result.description || ""}</text>
	
	</svg>`

	const svgBuffer = Buffer.from(svgText);
	const imageBuffer = Buffer.from(buffer);

	sharp(svgBuffer)
	.composite([{input: imageBuffer}])
	.toFile(`./processed/pro_${Date.now()}.jpg`)


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
