import { useState } from 'react'
import axios from 'axios'
import './App.css'
import TextBox from './Component/Textbox'
import Button from './Component/Button'

function App() {

  const [prompt, setPrompt] = useState("")

  //handle prompt Input
  const handlePrompt = (e) =>{
    setPrompt(e.target.value)
  }

  //handle Submission 
  const handleSubmit = async (e) =>{
    e.preventDefault()
    const posterInfo = {prompt}; //delete this when server is running
    //add post request axios in here 
    // try {
    //   const resp = await axios.post("/", {prompt:prompt});
    //   console.log(resp.data)
    // }
    // catch (error){
    //   console.log(error.response)
    // }
    console.log(posterInfo) // delete when server is running
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <label>Prompt:</label>
        <TextBox  prompt = "Please Enter A prompt" onChange = {handlePrompt}/> 
        <Button name = "Submit"></Button>
      </form>
    </div>
  )
}

export default App
