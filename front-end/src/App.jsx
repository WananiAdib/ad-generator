import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import TextBox from './Component/Textbox'
import Button from './Component/Button'

function App() {


  return (
    <div>
      <div>
        <p>Date:</p>
        <TextBox  prompt = "Please Enter Date"/> 
      </div>
      <div>
        <p>Location:</p>
        <TextBox prompt = "Please Enter Location of Event"/> 
      </div>
      <div>
        <p>Brief Description of Event:</p>
        <TextBox prompt = "Pleaser Enter Brief Description of Event"/> 
      </div>
      <Button name = "Submit"></Button>

    </div>
  )
}

export default App
