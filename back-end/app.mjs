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

const prompt =
	"Design a poster with a photo of students gathering, for PCI running an event on Monday at 5.15 pm";

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
	const width = 512;
	const height = 512;
	const text = "E.T, go home";

	const svgText = `
	<svg width="${width}" height="${height}">
		<style>
		.title { fill: black; font-size: 85px}
		.title2 { fill: black; font-size: 70px}
		</style>
		<text x="10%" y="10%" text-anchor="middle" class="title">${result.title}</text>
		<text x="10%" y="30%" text-anchor="middle" class="title2">${result.description}</text>
	</svg>`

	const svgBuffer = Buffer.from(svgText);

	sharp(imageName)
	.composite([{input: svgBuffer, left: 300, top: 300}])
	.toFile('./processed/text_robo.jpg')

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
