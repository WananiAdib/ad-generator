import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import TextBox from './Component/Textbox'
import Button from './Component/Button'

function App() {

  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [qr, setQr] = useState ("Yes")

  //handle Date Input
  const handleDate = (e) =>{
    setDate(e.target.value)
  }

  //handle Location Input 
  const handleLocation = (e) =>{
    setLocation(e.target.value)
  }

  //handle Description Input
  const handleDescription = (e) =>{
    setDescription(e.target.value)
  }

  //handle QR code
  const handleQr = (e) =>{
    setQr(e.target.value)
  }

  //handle Submission 
  const handleSubmit = (e) =>{
    e.preventDefault()
    const posterInfo = {date, location, description, qr};
    // add post request axios in here 
    console.log(posterInfo)
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <label>Date:</label>
        <TextBox  prompt = "Please Enter Date" onChange = {handleDate}/> 
        <label>Location:</label>
        <TextBox prompt = "Please Enter Location of Event" onChange = {handleLocation}/> 
        <label>Brief Description of Event:</label>
        <TextBox prompt = "Pleaser Enter Brief Description of Event" onChange ={handleDescription}/> 
        <label>QR Code</label>
        <select onChange = {handleQr}>
          <option value = "Yes">Yes</option>
          <option value= "No">No</option>
        </select>
        <Button name = "Submit"></Button>
      </form>


    </div>
  )
}

export default App
