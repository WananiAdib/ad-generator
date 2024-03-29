import express from "express";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as QRCode from "qrcode";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.static("processed"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connecting to the OpenAI api
const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

// const prompt =
// 	"We are going to have an event called pitch night where a few NYU Shanghai students are going to present in front of a jury of Chinese and western investors its going to be on May 11th, 2023 at 6pm at Room E403 on NYU Shanghai campus";

// const event_url = "https://engage.shanghai.nyu.edu/event/8917833";

app.listen(
	process.env.PORT || 5001,
	console.log(`Server starting at ${process.env.PORT || 5001}`)
);

app.post("/api", async (req, res) => {
	try {
		console.log(req.body);
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
			  from the prompt: ${req.body.prompt}
			  
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
		/*
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
		*/

		// -----Template 1 Code
		/*
		const svgText = `
		<svg width="1024" height="1366" xmlns="http://www.w3.org/2000/svg">
				<style>
				.title { fill: white; font-size: 85px}
				.title2 { fill: white; font-size: 40px}
			.title3 { fill: white; font-size: 20px}
				</style>
		  <rect width="1024" height="171" x="0" y="0" />
		  <rect width="1024" height="171" x="0" y="1195" />
		  <text x = "20" y = "80" class = "title">${result.title}</text>
		  <text x = "20" y = "140" class = "title2">${result.date}</text>
			<text x = "20" y = "1245" class = "title2">${result.location}</text>
		  <text x = "20" y = "1290" class = "title3">${result.description}</text>
		</svg>`
		*/
		// ----End of Template 1 Code ------

		// -----Template 2 code -------
		/*
			const svgText =
			`<svg width="1024" height="1366" xmlns="http://www.w3.org/2000/svg">
			<style>
			   body {background-color: black; font-family: Helvetica}
			.title { fill: white; font-size: 100px}
			.title2 { fill: white; font-size: 40px}
		   .title3 { fill: white; font-size: 20px}
			</style>
			<rect width="700" height="700" x="162" y="450" fill="white" />
			<text x = "50%" y = "16%" text-anchor="middle" font-family = "Helvetica" class = "title">${result.title}</text>
			<text x = "974" y = "1258" class = "title2"  text-anchor="end" > ${result.date}</text>
		   <text x = "50" y = "1258" class = "title2">${result.location}</text>
			<text x = "50%" y = "23%" class = "title3" text-anchor="middle" >
			   <tspan>${result.description}</tspan>
			   <tspan x = "50%" y = "25%"></tspan>
			 </text>

		  </svg>`

			const svgBuffer = Buffer.from(svgText);
			const imageBuffer = Buffer.from(buffer);
			const resizeImage = await sharp(buffer).resize(700).toBuffer();

			sharp(svgBuffer)
			.composite([{input: resizeImage, top: 450, left: 162}])
			.toFile(`./processed/pro_${Date.now()}.jpg`)
		*/
		// --- End of Template 2 Code ------

		// ---Template 3 Code -----
		/*
		const svgText = `
		<svg width="1024" height="1366" xmlns="http://www.w3.org/2000/svg">
		<style>
			.title { fill: white; font-size: 85px}
			.title2 { fill: white; font-size: 40px}
			.title3 { fill: white; font-size: 20px}
		</style>
		<rect width="1024" height="342" x="0" y="0" />
		<text x = "20" y = "110" class = "title">${result.title}</text>
		<text x = "20" y = "165" class = "title2">${result.date}</text>
		<text x = "20" y = "210" class = "title2">${result.location}</text>
		<text x = "20" y = "250" class = "title3">${result.description}</text>
		</svg>`

		const svgBuffer =  Buffer.from(svgText);
		const imageBuffer = Buffer.from(buffer);

		sharp(svgBuffer)
		.composite([{input: imageBuffer, top: 342, left:0}])
		.toFile(`./processed/pro_${Date.now()}.jpg`)
		*/
		// --- End of Template 3 Code ------

		//--- Template 4 Code-----
		const svgText = ` 
		<svg width="1024" height="1366" xmlns="http://www.w3.org/2000/svg">
		<style>
		.title { fill: white; font-size: 85px}
	   .title2 { fill: white; font-size: 40px}
		.title3 { fill: white; font-size: 30px}
	   </style>
		<rect width="1024" height="342" x="0" y="1024" />
		<text x = "20" y = "1100" class = "title">${result.title}</text>
		<text x = "20" y = "1200" class = "title2">${result.date}</text>
		<text x = "20" y = "1160" class = "title2">${result.location}</text>
		<text x = "20" y = "1250" class = "title3">${result.description}</text>
		</svg>`;

		const svgBuffer = Buffer.from(svgText);
		const imageBuffer = Buffer.from(buffer);
		const posterName = `pro_${Date.now()}.jpg`;

		sharp(svgBuffer)
			.composite([{ input: imageBuffer, top: 0, left: 0 }])
			.toFile(`./processed/${posterName}`);
		//----End of Template 4 Code----

		res.send({ url: posterName });
		console.log("done");
	} catch (error) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
	}
});
