import { useState } from "react";
import axios from "axios";
import "./App.css";
import TextBox from "./Component/Textbox";
import Button from "./Component/Button";

function App() {
  // states
	const [prompt, setPrompt] = useState("");
	const [imageData, setImageData] = useState("");
	const [imageLoaded, setImageLoaded] = useState(false);

	//handle prompt Input
	const handlePrompt = (e) => {
		setPrompt(e.target.value);
	};

	//handle Submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setImageLoaded(false);
		axios
			.post("/api", {
				prompt,
			})
			.then((res) => {
				console.log(res);
				setImageData(res.data.url);
				setTimeout(() => setImageLoaded(true), 1000);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>Prompt:</label>
				<TextBox
					prompt="Please Enter A prompt"
					onChange={handlePrompt}
				/>
				<Button name="Submit"></Button>
			</form>
			{imageLoaded && (
				<img
					src={`http://localhost:5001/${imageData}`}
					alt="My Image"
					width="50%"
				/>
			)}
		</div>
	);
}

export default App;
